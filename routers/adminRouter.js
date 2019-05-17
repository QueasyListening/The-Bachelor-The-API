const express = require('express');
const router = express.Router();
const config = require('../config');

const contestantSchema = require('../schemas/contestantSchema');
const Contestant = mongoose.model('Contestant', contestantSchema);
const pointsForFirstRose = 5;
const pointsForLastRose = 5;
const pointsForRosePick = 1;

function authenticateAdmin(req, res, next) {
    if (req.body.username === config.adminUserName && req.body.password === config.adminPassword)  {
        next();
    } else {
        res.status(400).json({ error: "You must be an admin to preform this function" });
    }
}

router.post("/addContestant", authenticateAdmin, (req, res) => {
    if (!req.body.contestant.name) {
        res.status(422).json({ error: 'Contestant must have a name' })
    } else {
        Contestant.findOne({ name: req.body.contestant.name }).then(response => {
            if (!response) {
                const contestant = new Contestant(req.body.contestant);
                contestant
                .save()
                .then(newContestant => {
                    res.status(201).json({ mgs: "New contestant created successfully", newContestant });
                })
                .catch(error => {
                    res.status(500).json({ error: "New contestant could not be created at this time." });
                });
            } else {
                res.status(422).json({ error: "A contestant with that name already exists."});
            }
        });
    };
});

router.put("/updateResults", authenticateAdmin, (req, res) => {
    const { weekNumber, recievedRose, firstRose, lastRose, recievedDate, recievedKiss } = req.body;
    let updatedContestants;
    if (!weekNumber || !recievedRose || !firstRose || !lastRose || !recievedDate || !recievedKiss) {
        res.status(400).json({ error: "Missing information. Complete all fields" });
    } else {
        Contestant
        .find()
        .then(contestants => {
            updatedContestants = constestant.map(constestant => {
                if (!recievedRose.includes(contestant.name)) {
                    contestant.weekEliminated = weekNumber;
                }

                if (contestant.name = firstRose) {
                    contestant.weeksFirstRose.push(weekNumber);
                }

                if (contestant.name = lastRose) {
                    contestant.weeksLastRose.push(weekNumber);
                }

                if (recievedDate.includes(contestant.name)) {
                    contestant.weeksDateRecieved.push(weekNumber);
                }

                if (recievedKiss.includes(contestant.name)) {
                    contestant.weeksKissed.push(weekNumber);
                }

                return contestant;
            });

            User
            .find()
            .then(users => {
                const noPick = { weekNumber, recievedRose: [] };

                let updatedUsers = users.map(user => {
                    // Check to make sure picks have been entered and enter dummy pick if not
                    if (user.weeklyPicks[user.weeklyPicks.length - 1].weekNumber !== weekNumber) {
                        user.weeklyPicks.push(noPick);
                    }
                    
                    // Calculate weekly picks score
                    let weeklyScore = 0;
                    if (user.firstRose && user.firstRose === firstRose) {
                        weeklyScore += pointsForFirstRose;
                    }
                    if (user.lastRose._id && user.lastRose._id === lastRose._id) {
                        weeklyScore += pointsForLastRose;
                    }
                    user.recievedRose.forEach(pick => {
                        if (recievedRose.includes(pick)) {
                            weeklyScore += pointsForRosePick;
                        }
                    });
                });
            });
        })
        .catch(error => {
            res.send(error);
        });
    }
});

module.exports = router;