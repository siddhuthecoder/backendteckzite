import  UserQRModel from "../models/userQRModel.js";


export const qrUserAdd = async (req, res) => {
  try {
   
    const userData = req.body;

    const newUser = new UserQRModel(userData);

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Failed to add user', error: error.message });
  }
};


export const getUserByTzkid = async (req, res) => {
  try {
    
    const { tzkid } = req.params;

   
    const user = await UserQRModel.findOne({ tzkid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Failed to fetch user data', error: error.message });
  }
}