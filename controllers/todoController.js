import Todo from "../model/todoModel.js";

// GET /api/todos  (protected)
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ count: todos.length, todos });
  } catch (error) {
    console.error("GET TODOS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/todos/:id  (protected)
export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(todo);
  } catch (error) {
    console.error("GET TODO ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/todos  (protected)
export const createTodo = async (req, res) => {
  try {
    console.log("CREATE TODO body:", req.body); // debug
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description?.trim() || "",
      user: req.user._id,
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error("CREATE TODO ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/todos/:id  (protected)
export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    if (req.body.title !== undefined) todo.title = req.body.title;
    if (req.body.description !== undefined) todo.description = req.body.description;
    if (req.body.completed !== undefined) todo.completed = req.body.completed;

    const updated = await todo.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error("UPDATE TODO ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/todos/:id  (protected)
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json({ message: "Todo deleted", id: todo._id });
  } catch (error) {
    console.error("DELETE TODO ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};