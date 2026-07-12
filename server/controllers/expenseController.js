const Expense = require('../models/Expense');

const getExpenses = async (req, res) => {
  try {
    const { vehicleId, tripId } = req.query;
    const filter = {};
    if (vehicleId) filter.vehicle = vehicleId;
    if (tripId) filter.trip = tripId;
    const expenses = await Expense.find(filter)
      .populate('vehicle', 'registrationNumber name')
      .populate('trip', 'tripId source destination')
      .sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    await expense.populate('vehicle trip');
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('vehicle', 'registrationNumber name')
      .populate('trip', 'tripId');
    if (!expense) return res.status(404).json({ message: 'Expense not found.' });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found.' });
    res.json({ message: 'Expense deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense };
