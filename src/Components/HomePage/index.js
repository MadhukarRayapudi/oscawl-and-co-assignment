import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../Navbar";
import './index.css';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(''); // For adding a new task
  const [editTaskId, setEditTaskId] = useState(null); // For tracking the task being edited
  const [editTaskDescription, setEditTaskDescription] = useState(''); // For editing task description
  const [editTaskStatus, setEditTaskStatus] = useState('pending'); // For editing task status
  const navigate = useNavigate();

  const fetchTasks = useCallback((token) => {
    fetch('http://localhost:3001/tasks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        return response.json();
      })
      .then(data => setTasks(data))
      .catch(error => {
        console.error('Error fetching tasks:', error);
        navigate('/login'); // Redirect to login on error
      });
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if no token is found
    } else {
      fetchTasks(token);
    }
  }, [fetchTasks, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login page on logout
  };

  const handleNewTaskChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleAddTask = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ description: newTask, status: 'pending' })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add task');
        }
        return response.text();
      })
      .then(() => {
        fetchTasks(token);
        setNewTask(''); // Clear input after adding
      })
      .catch(error => {
        console.error('Error adding task:', error);
      });
  };

  const handleDeleteTask = (taskId) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete task');
        }
        return response.text();
      })
      .then(() => {
        fetchTasks(token);
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  };

  const handleEditTask = (task) => {
    setEditTaskId(task.id);
    setEditTaskDescription(task.description);
    setEditTaskStatus(task.status);
  };

  const handleUpdateTask = () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3001/tasks/${editTaskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ description: editTaskDescription, status: editTaskStatus })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update task');
        }
        return response.text();
      })
      .then(() => {
        fetchTasks(token);
        setEditTaskId(null); // Reset edit mode
        setEditTaskDescription('');
        setEditTaskStatus('pending');
      })
      .catch(error => {
        console.error('Error updating task:', error);
      });
  };

  return (
    <div className="home-page">
      <Navbar handleLogout={handleLogout} />
      {/* Add new task form */}
      <div className="add-tasks-container">
        <h2>Add Task</h2>
        <input
          type="text"
          value={newTask}
          onChange={handleNewTaskChange}
          placeholder="Enter new task"
          className="add-task-input-field"
        />
        <button onClick={handleAddTask} className="add-task-btn">Add Task</button>
      </div>

      {/* Tasks list */}
      <h2 className="your-tasks-heading">Your Tasks</h2>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="each-task">
              {editTaskId === task.id ? (
                <div>
                  <input
                    type="text"
                    value={editTaskDescription}
                    onChange={(e) => setEditTaskDescription(e.target.value)}
                    className="edit-task-input-field"
                  />
                  <select
                    value={editTaskStatus}
                    onChange={(e) => setEditTaskStatus(e.target.value)}
                    className="task-status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button onClick={handleUpdateTask} className="update-task-btn">Update</button>
                </div>
              ) : (
                <div>
                  <span className={task.status === 'completed' ? 'task-completed' : ''}>
                    {task.description}
                  </span> - <span>{task.status}</span>
                  <button className="edit-btn" onClick={() => handleEditTask(task)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <h1 className="hooray-text">Hooray! No Pending Tasks</h1>
      )}
    </div>
  );
};

export default HomePage;
