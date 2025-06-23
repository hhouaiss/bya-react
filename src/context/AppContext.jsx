import React, { createContext, useContext, useReducer, useEffect } from 'react';
import OpenAI from 'openai';

// Initial state for the app
const initialState = {
  savedApps: [],
  currentApp: null,
  isGenerating: false,
  generatedApps: new Map(),
  aiClient: null,
};

// Action types
const ActionTypes = {
  SET_SAVED_APPS: 'SET_SAVED_APPS',
  ADD_APP: 'ADD_APP',
  SET_CURRENT_APP: 'SET_CURRENT_APP',
  SET_GENERATING: 'SET_GENERATING',
  SET_GENERATED_APP: 'SET_GENERATED_APP',
  UPDATE_APP: 'UPDATE_APP',
  DELETE_APP: 'DELETE_APP',
  INIT_AI_CLIENT: 'INIT_AI_CLIENT',
};

/**
 * Reducer function to manage app state
 */
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_SAVED_APPS:
      return { ...state, savedApps: action.payload };
    
    case ActionTypes.ADD_APP:
      const newSavedApps = [...state.savedApps, action.payload];
      localStorage.setItem('bya-saved-apps', JSON.stringify(newSavedApps));
      return { ...state, savedApps: newSavedApps };
    
    case ActionTypes.SET_CURRENT_APP:
      return { ...state, currentApp: action.payload };
    
    case ActionTypes.SET_GENERATING:
      return { ...state, isGenerating: action.payload };
    
    case ActionTypes.SET_GENERATED_APP:
      const newGeneratedApps = new Map(state.generatedApps);
      newGeneratedApps.set(action.payload.id, action.payload.content);
      return { ...state, generatedApps: newGeneratedApps };
    
    case ActionTypes.UPDATE_APP:
      const updatedApps = state.savedApps.map(app => 
        app.id === action.payload.id ? { ...app, ...action.payload.updates } : app
      );
      localStorage.setItem('bya-saved-apps', JSON.stringify(updatedApps));
      return { ...state, savedApps: updatedApps };
    
    case ActionTypes.DELETE_APP:
      const filteredApps = state.savedApps.filter(app => app.id !== action.payload);
      localStorage.setItem('bya-saved-apps', JSON.stringify(filteredApps));
      return { ...state, savedApps: filteredApps };
    
    case ActionTypes.INIT_AI_CLIENT:
      return { ...state, aiClient: action.payload };
    
    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

/**
 * AppProvider component to wrap the app with global state
 */
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved apps from localStorage on mount
  useEffect(() => {
    const savedApps = JSON.parse(localStorage.getItem('bya-saved-apps')) || [];
    dispatch({ type: ActionTypes.SET_SAVED_APPS, payload: savedApps });
  }, []);

  /**
   * Initialize AI client with environment variable
   */
  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (apiKey) {
      const client = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Note: For production, use a backend proxy
      });
      dispatch({ type: ActionTypes.INIT_AI_CLIENT, payload: client });
    } else {
      console.warn('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file.');
    }
  }, []);

  /**
   * Generate app using real OpenAI API
   */
  const generateApp = async (prompt) => {
    if (!state.aiClient) {
      throw new Error('AI client not initialized. Please check your API key.');
    }

    dispatch({ type: ActionTypes.SET_GENERATING, payload: true });
    
    try {
      const completion = await state.aiClient.chat.completions.create({
        model: "gpt-4.1",
        messages: [
          {
            role: "system",
            content: `You are a creative web developer and UI/UX designer. Create a beautiful, functional HTML app that delights users.

RESPONSE FORMAT: Return only HTML code starting with <!DOCTYPE html> and ending with </html>. No explanations, comments, or markdown blocks.

DESIGN PHILOSOPHY:
- Create stunning, modern interfaces that users will love
- Be creative with colors, animations, and layouts
- Think like a mobile app designer - make it feel native
- Use your best judgment for themes and aesthetics

TECHNICAL REQUIREMENTS:
- Complete HTML with embedded CSS and JavaScript
- Fully responsive and mobile-optimized
- Include smooth animations and micro-interactions
- Use modern CSS features (gradients, shadows, animations)
- Add delightful details (hover effects, transitions, icons)
- Implement all requested functionality perfectly
- Use Google Fonts for beautiful typography
- Handle edge cases gracefully

CREATIVE FREEDOM:
- Choose the most appropriate color scheme and theme
- Add visual flourishes that enhance the experience
- Include relevant icons or emoji where appropriate
- Make the UI intuitive and enjoyable to use
- Surprise and delight with thoughtful design choices

Build something users will want to use every day!`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      });

      const generatedCode = completion.choices[0].message.content;
      
      // Extract app metadata using another AI call
      const metadataCompletion = await state.aiClient.chat.completions.create({
        model: "gpt-4.1",
        messages: [
          {
            role: "system",
            content: `Return ONLY a valid JSON object. No explanations. No comments. No markdown blocks.

Based on the user's app request, provide this exact JSON format:
{
  "name": "short app name",
  "description": "brief description", 
  "type": "one of: todo, habit, expense, notes, calculator, timer, tracker, converter, generator, or other"
}

Your response must start with { and end with }. Nothing else.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.3
      });

      let metadata;
      try {
        metadata = JSON.parse(metadataCompletion.choices[0].message.content);
      } catch {
        // Fallback metadata if JSON parsing fails
        metadata = {
          name: "Custom App",
          description: "AI-generated application",
          type: "other"
        };
      }

      const appId = Date.now().toString();
      const appData = {
        id: appId,
        name: metadata.name,
        description: metadata.description,
        type: metadata.type,
        createdAt: new Date().toISOString(),
        prompt: prompt
      };

      dispatch({ type: ActionTypes.SET_GENERATED_APP, payload: { id: appId, content: generatedCode } });
      dispatch({ type: ActionTypes.SET_CURRENT_APP, payload: appData });
      
      return appData;
    } catch (error) {
      console.error('Error generating app:', error);
      throw new Error(`Failed to generate app: ${error.message}`);
    } finally {
      dispatch({ type: ActionTypes.SET_GENERATING, payload: false });
    }
  };

  /**
   * Update app with follow-up changes using real AI
   */
  const updateAppWithFollowUp = async (appId, followUpPrompt) => {
    if (!state.aiClient) {
      throw new Error('AI client not initialized.');
    }

    dispatch({ type: ActionTypes.SET_GENERATING, payload: true });
    
    try {
      const currentCode = state.generatedApps.get(appId);
      
      const completion = await state.aiClient.chat.completions.create({
        model: "gpt-4.1",
        messages: [
          {
            role: "system",
            content: "You are an expert web developer. Modify the existing HTML app based on the user's request. Return ONLY the complete, updated HTML code."
          },
          {
            role: "user",
            content: `Here's the current app code:\n\n${currentCode}\n\nPlease modify it to: ${followUpPrompt}`
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      });

      const updatedCode = completion.choices[0].message.content;
      dispatch({ type: ActionTypes.SET_GENERATED_APP, payload: { id: appId, content: updatedCode } });
      
      return true;
    } catch (error) {
      console.error('Error updating app:', error);
      throw new Error(`Failed to update app: ${error.message}`);
    } finally {
      dispatch({ type: ActionTypes.SET_GENERATING, payload: false });
    }
  };

  /**
   * Save current app to saved apps
   */
  const saveCurrentApp = () => {
    if (state.currentApp) {
      dispatch({ type: ActionTypes.ADD_APP, payload: state.currentApp });
    }
  };

  const value = {
    ...state,
    generateApp,
    saveCurrentApp,
    updateAppWithFollowUp,
    dispatch
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Custom hook to use the app context
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// App code generators (simplified versions)
function generateHabitTrackerCode() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Habit Tracker</title>
    <style>
        body { font-family: 'Inter', sans-serif; background: #191919; color: white; margin: 0; padding: 20px; }
        .habit-card { background: #2f2f2f; border-radius: 8px; padding: 16px; margin: 8px 0; }
        .habit-name { font-weight: 600; margin-bottom: 8px; }
        .progress-bar { background: #3f3f3f; height: 8px; border-radius: 4px; overflow: hidden; }
        .progress-fill { background: #2383e2; height: 100%; transition: width 0.3s; }
        button { background: #2383e2; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Habit Tracker</h1>
    <div id="habits"></div>
    <script>
        const habits = [
            { name: 'Drink Water', progress: 60 },
            { name: 'Exercise', progress: 30 },
            { name: 'Read', progress: 80 }
        ];
        
        function renderHabits() {
            const container = document.getElementById('habits');
            container.innerHTML = habits.map(habit => \`
                <div class="habit-card">
                    <div class="habit-name">\${habit.name}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: \${habit.progress}%"></div>
                    </div>
                    <button onclick="updateProgress('\${habit.name}')">Mark Complete</button>
                </div>
            \`).join('');
        }
        
        function updateProgress(name) {
            const habit = habits.find(h => h.name === name);
            if (habit && habit.progress < 100) {
                habit.progress = Math.min(100, habit.progress + 20);
                renderHabits();
            }
        }
        
        renderHabits();
    </script>
</body>
</html>
  `;
}

function generateExpenseTrackerCode() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expense Tracker</title>
    <style>
        body { font-family: 'Inter', sans-serif; background: #191919; color: white; margin: 0; padding: 20px; }
        .expense-item { background: #2f2f2f; border-radius: 8px; padding: 16px; margin: 8px 0; display: flex; justify-content: space-between; }
        .total { background: #2383e2; padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
        input { background: #2f2f2f; border: 1px solid #3f3f3f; color: white; padding: 8px; border-radius: 4px; margin: 4px; }
        button { background: #2383e2; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Expense Tracker</h1>
    <div class="total">Total: $<span id="total">0</span></div>
    <div>
        <input type="text" id="description" placeholder="Description">
        <input type="number" id="amount" placeholder="Amount">
        <button onclick="addExpense()">Add Expense</button>
    </div>
    <div id="expenses"></div>
    <script>
        let expenses = [];
        
        function addExpense() {
            const desc = document.getElementById('description').value;
            const amount = parseFloat(document.getElementById('amount').value);
            if (desc && amount) {
                expenses.push({ description: desc, amount: amount });
                document.getElementById('description').value = '';
                document.getElementById('amount').value = '';
                renderExpenses();
            }
        }
        
        function renderExpenses() {
            const container = document.getElementById('expenses');
            const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
            document.getElementById('total').textContent = total.toFixed(2);
            
            container.innerHTML = expenses.map(exp => \`
                <div class="expense-item">
                    <span>\${exp.description}</span>
                    <span>$\${exp.amount.toFixed(2)}</span>
                </div>
            \`).join('');
        }
        
        renderExpenses();
    </script>
</body>
</html>
  `;
}

function generateNotesAppCode() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notes App</title>
    <style>
        body { font-family: 'Inter', sans-serif; background: #191919; color: white; margin: 0; padding: 20px; }
        .note { background: #2f2f2f; border-radius: 8px; padding: 16px; margin: 8px 0; }
        .note-title { font-weight: 600; margin-bottom: 8px; }
        textarea { background: #2f2f2f; border: 1px solid #3f3f3f; color: white; padding: 8px; border-radius: 4px; width: 100%; margin: 4px 0; }
        button { background: #2383e2; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Notes App</h1>
    <div>
        <input type="text" id="noteTitle" placeholder="Note title" style="background: #2f2f2f; border: 1px solid #3f3f3f; color: white; padding: 8px; border-radius: 4px; width: 100%; margin: 4px 0;">
        <textarea id="noteContent" placeholder="Write your note..." rows="4"></textarea>
        <button onclick="addNote()">Add Note</button>
    </div>
    <div id="notes"></div>
    <script>
        let notes = [];
        
        function addNote() {
            const title = document.getElementById('noteTitle').value;
            const content = document.getElementById('noteContent').value;
            if (title && content) {
                notes.push({ title: title, content: content, date: new Date().toLocaleDateString() });
                document.getElementById('noteTitle').value = '';
                document.getElementById('noteContent').value = '';
                renderNotes();
            }
        }
        
        function renderNotes() {
            const container = document.getElementById('notes');
            container.innerHTML = notes.map(note => \`
                <div class="note">
                    <div class="note-title">\${note.title}</div>
                    <div style="color: #9b9b9b; font-size: 12px; margin-bottom: 8px;">\${note.date}</div>
                    <div>\${note.content}</div>
                </div>
            \`).join('');
        }
        
        renderNotes();
    </script>
</body>
</html>
  `;
}

function generateTodoAppCode() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App</title>
    <style>
        body { font-family: 'Inter', sans-serif; background: #191919; color: white; margin: 0; padding: 20px; }
        .todo-item { background: #2f2f2f; border-radius: 8px; padding: 16px; margin: 8px 0; display: flex; align-items: center; }
        .todo-item.completed { opacity: 0.6; text-decoration: line-through; }
        input[type="checkbox"] { margin-right: 12px; }
        input[type="text"] { background: #2f2f2f; border: 1px solid #3f3f3f; color: white; padding: 8px; border-radius: 4px; flex: 1; margin-right: 8px; }
        button { background: #2383e2; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Todo App</h1>
    <div style="display: flex; margin-bottom: 20px;">
        <input type="text" id="todoInput" placeholder="Add a new todo...">
        <button onclick="addTodo()">Add</button>
    </div>
    <div id="todos"></div>
    <script>
        let todos = [];
        
        function addTodo() {
            const input = document.getElementById('todoInput');
            if (input.value.trim()) {
                todos.push({ text: input.value.trim(), completed: false, id: Date.now() });
                input.value = '';
                renderTodos();
            }
        }
        
        function toggleTodo(id) {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                renderTodos();
            }
        }
        
        function renderTodos() {
            const container = document.getElementById('todos');
            container.innerHTML = todos.map(todo => \`
                <div class="todo-item \${todo.completed ? 'completed' : ''}">
                    <input type="checkbox" \${todo.completed ? 'checked' : ''} onchange="toggleTodo(\${todo.id})">
                    <span>\${todo.text}</span>
                </div>
            \`).join('');
        }
        
        renderTodos();
    </script>
</body>
</html>
  `;
}

export { ActionTypes };