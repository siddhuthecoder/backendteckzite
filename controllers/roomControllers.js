import Room from "../models/roomModel.js";

export const createRooms = async (req, res) => {
  try {
    const { roomNumbers, gender } = req.body;

    const createdRooms = await Promise.all(
      roomNumbers.map(async (roomNo) => {
        const roomData = { roomNo, gender };
        return await Room.create(roomData);
      })
    );

    res.status(200).json({ createdRooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addPerson = async (req, res) => {
  const { tzkid, gender } = req.body;

  try {
    const existingRoom = await Room.findOne({
      gender,
      people: tzkid.toLowerCase(),
    });
    if (existingRoom) {
      return res
        .status(500)
        .json({ message: "Person already assigned to a room" });
    }

    const rooms = await Room.find({ gender }).sort({ createdAt: 1 });
    let roomFound = false;
    let roomNumber = "";
    for (const room of rooms) {
      if (room.people.length < 6) {
        room.people.push(tzkid.toLowerCase());
        await room.save();
        roomNumber = room.roomNo;
        roomFound = true;
        break;
      }
    }

    if (!roomFound) {
      return res
        .status(404)
        .json({ message: "No available room for this gender" });
    }

    res
      .status(200)
      .json({ roomNumber, message: "Person added to a room successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const findPerson = async (req, res) => {
  const { id } = req.params;

  try {
    const rooms = await Room.find();
    for (const room of rooms) {
      for (const person of room.people) {
        if (person === id.toLowerCase()) {
          return res.status(200).json({ roomNumber: room.roomNo });
        }
      }
    }
    return res.status(200).json({ message: "No Room Allocated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
