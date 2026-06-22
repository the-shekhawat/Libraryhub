import Member from "../models/Member.js";

// CREATE MEMBER (USER SPECIFIC)
export const addMember = async (req, res) => {
    try {
        const {
            full_name,
            phone_number,
            verification_number,
            joining_date,
            seat_number
        } = req.body;

        const member = await Member.create({
            full_name,
            phone_number,
            verification_number,
            joining_date,
            seat_number,
            userId: req.user._id   // 🔥 IMPORTANT
        });

        res.status(201).json(member);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL MEMBERS FOR LOGGED IN USER
export const getMembers = async (req, res) => {
    try {
        const members = await Member.find({
            userId: req.user._id   // 🔥 FILTER BY USER
        });

        res.json(members);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// NEW: UPDATE MEMBER PROFILE DETAILS
export const updateMember = async (req, res) => {
    try {
        const {
            full_name,
            phone_number,
            verification_number,
            joining_date,
            seat_number
        } = req.body;

        // Find the member by ID AND check that it belongs to the logged-in user
        const member = await Member.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user._id
            },
            {
                $set: {
                    full_name,
                    phone_number,
                    verification_number,
                    joining_date,
                    seat_number
                }
            },
            { new: true, runValidators: true } // 'new: true' returns the updated document back to the frontend
        );

        if (!member) {
            return res.status(404).json({ message: "Member not found or unauthorized" });
        }

        res.json(member);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE MEMBER
export const deleteMember = async (req, res) => {
    try {
        const member = await Member.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        await member.deleteOne();

        res.json({ message: "Member deleted" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// TOGGLE OR DEACTIVATE MEMBER STATUS
export const updateMemberStatus = async (req, res) => {
    try {
        const member = await Member.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user._id
            },
            {
                is_active: false
            },
            { new: true }
        );

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.json(member);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};