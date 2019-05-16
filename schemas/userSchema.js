const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const SALT = 11;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,

        },
        password: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        squad: [
            {
                contestant: {
                    type: Schema.Types.ObjectId,
                    ref: 'Contestant'
                },
                weeksOnSquad: {
                    type: Number,
                    default: 1     
                }               
            }
        ],
        squadScores: [Number],
        weeklyPicks: [
            {
                weekNumber: {
                    type: Number,
                    requierd: true
                },
                firstRose: {
                    type: Schema.Types.ObjectId, 
                    ref: 'Contestant'
                },
                lastRose: {
                    type: Schema.Types.ObjectId, 
                    ref: 'Contestant'                     
                },
                rosesRecieved: [
                    {
                        type: Schema.Types.ObjectId,
                        ref: 'Contestant'
                    }
                ]
            }
        ],
        weeklyPicksScores: [Number]
    }
)

userSchema.pre('save', function(next) {
    if (this.password && this.isModified('password')) {
      bcrypt
        .hash(this.password, SALT)
        .then(hash => {
          this.password = hash;
          next();
        })
        .catch(err => {
          return next(err);
        });
    } else {
        next();
    }
});

// authentication method
userSchema.methods.isPasswordValid = function(passwordGuess) {
    return bcrypt.compare(passwordGuess, this.password);
};

module.exports = userSchema;