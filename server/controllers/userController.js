import zod from 'zod'
import connectToDb from '../db/index.js'
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const cookieOptions = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: true
}

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const signupSchema = zod.object({
            username: zod.string(),
            email: zod.string().email(),
            password: zod.string().min(8)
        })
        const connection = await connectToDb();

        const signupParsed = signupSchema.safeParse(req.body);
        if (!signupParsed.success) {
            return res.status(400).json({
                success: false,
                message: "Every field is required "
            });
        }

        const [userTables] = await connection.query("SHOW TABLES LIKE 'USERS'");
        if (userTables.length === 0) {
            await connection.query(`
            CREATE TABLE USERS (
                ID INT PRIMARY KEY AUTO_INCREMENT,
                USERNAME VARCHAR(20),
                EMAIL VARCHAR(20) UNIQUE,
                ROLE ENUM('user','admin') NOT NULL DEFAULT 'user',
                PASSWORD VARCHAR(200),
                ROLE ENUM('user', 'admin') DEFAULT 'user'
            );            
            `);
        }

        const userExists = (`SELECT * FROM USERS WHERE EMAIL=?`)

        const userExistsValues = email
        // console.log(userExistsValues);

        const [userExistsQuery] = await connection.query(userExists, userExistsValues);
        // console.log(userExistsQuery.length);
        if (userExistsQuery.length > 0) {
            res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const userQuery = (`
                INSERT INTO USERS (USERNAME,EMAIL,PASSWORD) VALUES (?,?,?)
            `)

            // const userValues = [username, email, password]

            // Hashing the password
            const userValues = [username, email, hashedPassword]

            const [user] = await connection.query(userQuery, userValues)

            // console.log("User created");
            if (!user) {
                return res.status(500).send("Server Error")
            }
            const userId = user.insertId
            // console.log(userId);

            const token = jwt.sign({
                userId,
            }, process.env.JWT_SECRET || 'LanguageTranslatorApp')

            const newUser = (`SELECT USERNAME,EMAIL,ROLE FROM USERS WHERE ID=?`)

            const newUserValues = userId
            const [newUserQuery] = await connection.query(newUser, newUserValues);

            return res
                .status(200)
                .cookie("token", token, cookieOptions)
                .json({
                    success: true,
                    message: "User created successfully",
                    token: token,
                    newUserQuery
                })
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: `Account already exist with the provided email ${email}`
        });
    }
};

const signin = async (req, res, next) => {

    const signinSchema = zod.object({
        email: zod.string().email(),
        password: zod.string().min(8)
    })
    const { email, password } = req.body;

    const connection = await connectToDb()

    const signinParsed = signinSchema.safeParse(req.body)

    if (!signinParsed.success) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    try {
        const userExists = (`SELECT EMAIL,PASSWORD,ID,ROLE FROM USERS
        WHERE EMAIL=?
        `)

        const userExistsValues = email
        const [userExistsQuery] = await connection.query(userExists, userExistsValues);
        // console.log(userExistsQuery);

        if (userExistsQuery.length === 0) {
            res.status(400).json({
                success: false,
                message: "User doesn't exist"
            })
        }

        const correctPassword = await bcrypt.compare(password, userExistsQuery[0].PASSWORD)
        // console.log(correctPassword);

        if (!userExistsQuery || !(correctPassword)) {
            return res.status(401).send("Password is incorrect")
        }
        if (!userExistsQuery || !(correctPassword)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign({
            userId: userExistsQuery[0].ID,
            role: userExistsQuery[0].ROLE
        }, process.env.JWT_SECRET)



        return res
            .status(200)
            .cookie("token", token, cookieOptions)
            .json({
                success: true,
                message: "User logged in successfully",
                userId: userExistsQuery[0].ID,
                role: userExistsQuery[0].ROLE,
                token: token,
                userExistsQuery
            })
        // return

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const getUser = async (req, res) => {
    const userId = req.userId;
    // console.log(userId);
    const connection = await connectToDb()
    try {
        const [user] = await connection.query(`SELECT USERNAME , EMAIL ,ROLE FROM USERS WHERE ID=${userId}`)

        // console.log(user[0].USERNAME);

        if (!user) {
            res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            user: user[0]
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const userId = req.userId;
        // console.log(userId);
        const connection = await connectToDb();
        try {
            // Check if the user is an admin
            const [user] = await connection.query('SELECT ROLE FROM USERS WHERE ID = ?', [userId]);
            if (!user || user.length === 0 || user[0].ROLE !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized to access this resource'
                });
            }
            // Retrieve all users except the admin
            const [users] = await connection.query('SELECT ID, USERNAME, EMAIL, ROLE FROM USERS WHERE ROLE != ?', ['admin']);
            // console.log(users);
            return res.status(200).json({
                success: true,
                users
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        } finally {
            // Close the database connection
            await connection.end();
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}


const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        res.status(200).json({
            success: true,
            message: "Logout successfull"
        })
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        });
    }
}

const getUserTranslations = async (req, res) => {
    const userId = req.params.userId;
    // console.log(userId);
    try {
        // Connect to the database
        const connection = await connectToDb();

        // Query the database for translations of the specified user
        const [rows] = await connection.query('SELECT id,original_text,translated_text FROM translations WHERE user_id = ?', [userId]);
        // console.log(rows);`
        // If no translations are found, return a 404 response
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No translations found for this user' });
        }

        // If translations are found, return them in the response
        res.status(200).json({ translations: rows });
    } catch (error) {
        // If an error occurs, log it and return a 500 response
        console.error('Error fetching translations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export {
    signup,
    signin,
    getUser,
    logout,
    getAllUsers,
    getUserTranslations
}

// const signupSchema = zod.object({
//     username: zod.string(),
//     email: zod.string().email(),
//     password: zod.string().min(8)
// });

// const signinSchema = zod.object({
//     email: zod.string().email(),
//     password: zod.string().min(8)
// });
// const connection = await connectToDb();
// // Function to handle user signup
// const signup = async (req, res) => {
//     try {
//         // Validate request body
//         const { username, email, password } = signupSchema.parse(req.body);

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insert user into database
//         const insertUserQuery = 'INSERT INTO USERS (USERNAME, EMAIL, PASSWORD) VALUES (?, ?, ?)';
//         const insertUserValues = [username, email, hashedPassword];
//         await connection.query(insertUserQuery, insertUserValues);

//         // Generate JWT token
//         const token = jwt.sign({ email }, process.env.JWT_SECRET);

//         res.cookie('token', token, { httpOnly: true });
//         res.status(200).json({
//             success: true,
//             message: 'User created successfully',
//             token
//         });
//     } catch (error) {
//         if (error instanceof zod.ZodError) {
//             res.status(400).json({
//                 success: false,
//                 message: 'Invalid request data',
//                 errors: error.errors.map(err => err.message)
//             });
//         } else {
//             console.error('Error during signup:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Internal server error'
//             });
//         }
//     }
// };

// // Function to handle user signin
// const signin = async (req, res) => {
//     try {
//         // Validate request body
//         const { email, password } = signinSchema.parse(req.body);

//         // Retrieve user from database
//         const getUserQuery = 'SELECT * FROM USERS WHERE EMAIL = ?';
//         const getUserValues = [email];
//         const [user] = await connection.query(getUserQuery, getUserValues);
//         console.log(user);
//         console.log(user.PASSWORD);
//         if (!user || !(await bcrypt.compare(password, user.PASSWORD))) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid email or password'
//             });
//         }

//         // Generate JWT token
//         const token = jwt.sign({ email }, process.env.JWT_SECRET);

//         res.cookie('token', token, { httpOnly: true });
//         res.status(200).json({
//             success: true,
//             message: 'User logged in successfully',
//             token
//         });
//     } catch (error) {
//         if (error instanceof zod.ZodError) {
//             res.status(400).json({
//                 success: false,
//                 message: 'Invalid request data',
//                 errors: error.errors.map(err => err.message)
//             });
//         } else {
//             console.error('Error during signin:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Internal server error'
//             });
//         }
//     }
// };

// // Function to get user details
// const getUser = async (req, res) => {
//     const { userId } = req.params;

//     try {
//         // Validate user ID
//         if (!userId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'User ID is required'
//             });
//         }

//         // Retrieve user from database
//         const getUserQuery = 'SELECT USERNAME, EMAIL FROM USERS WHERE ID = ?';
//         const getUserValues = [userId];
//         const [user] = await connection.query(getUserQuery, getUserValues);

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             user
//         });
//     } catch (error) {
//         console.error('Error fetching user:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// };

// // Function to handle user logout
// const logout = (req, res) => {
//     res.clearCookie('token');
//     res.status(200).json({
//         success: true,
//         message: 'Logout successful'
//     });
// };

// export {
//     signup,
//     signin,
//     getUser,
//     logout
// };