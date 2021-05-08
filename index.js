const LogSection = () => {
    const {messages, setMessages} = React.useContext(AppContext);
    const clearLogs = (e) => {
        e.preventDefault();
        setMessages([]);
    }
    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h1>Log Section</h1>
                </div>
                <div className="card-body">
                    <div className="card-row">
                        <ul>
                            {messages.map(msg =>
                                <li key={Math.random()}>{msg}</li>
                            )}
                        </ul>
                    </div>
                </div>
                <button onClick={clearLogs}>Clear all the logs</button>
            </div>
        </>
    )
}

const UserDetail = () => {
    const {user, setUser} = React.useContext(AppContext);
    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h1>User's detail:</h1>
                </div>
                <div className="card-body">
                    <div className="card-row">
                        <div className="card-col">email</div>
                        <div className="card-col">{user.email}</div>
                    </div>
                    <div className="card-row">
                        <div className="card-col">uid</div>
                        <div className="card-col">{user.uid}</div>
                    </div>
                    <div className="card-row">
                        <div className="card-col">displayName</div>
                        <div className="card-col">{user.displayName}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

const UpdateProfileSection = () => {
    const [password, setPassword] = React.useState('');
    const [displayName, setDisplayName] = React.useState('');
    const {addMsg, setUser} = React.useContext(AppContext);
    const updatePassword = (e) => {
        e.preventDefault();
        const user = firebase.auth().currentUser;
        user.updatePassword(password).then(function() {
            setPassword('');
            addMsg('Update password successful.');
        }).catch(function(error) {
            addMsg('Can not update password');
            addMsg(JSON.stringify(error, null, 4));
        });
    }
    const updateDisplayName = (e) => {
        e.preventDefault();
        const user = firebase.auth().currentUser;
        const udate = {displayName};
        user.updateProfile(udate).then(function(x) {
            setUser(user => ({...user, ...udate}));
            addMsg('Update profile successful.');
        }).catch(function(error) {
            addMsg('Can not update profile');
            addMsg(JSON.stringify(error, null, 4));
        });
    }
    const sendEmailVerification = (e) => {
        e.preventDefault();
        const user = firebase.auth().currentUser;
        user.sendEmailVerification().then(function() {
            addMsg('Email verification sent.');
        }).catch(function(error) {
            addMsg('Cant not send email verification');
            addMsg(JSON.stringify(error, null, 4));
        });
    }
    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h1>Update Profile Section</h1>
                </div>
                <div className="card-body">
                    <div className="card-row">
                        <div className="card-col">
                            <input type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="card-col">
                            <button onClick={updatePassword}>Update password</button>
                        </div>
                    </div>
                    <div className="card-row">
                        <div className="card-col">
                            <input type="input" placeholder="Your displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                        </div>
                        <div className="card-col">
                            <button onClick={updateDisplayName}>Update displayName</button>
                        </div>
                    </div>
                    <div className="card-row">
                        <div className="card-col">
                            <button onClick={sendEmailVerification}>Send Email Verification</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const AddRecordSection = () => {
    const [domain, setDomain] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [notes, setNotes] = React.useState('');
    const {user, addMsg, records, setRecords} = React.useContext(AppContext);
    const addNewRecord = (e) => {
        e.preventDefault();
        const newRecordData = {
            domain,
            username,
            email,
            password,
            notes,
        }
        db.collection(`users/${user.uid}/records`).add(newRecordData)
        .then((docRef) => {
            addMsg("Document written with ID: " + docRef.id);
            setRecords(records => [...records, {data: newRecordData, id: docRef.id}]);
        })
        .catch((error) => {
            addMsg("Error adding document");
            addMsg(JSON.stringify(error, null, 4));
        });
    }

    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h1>Add Record Section</h1>
                </div>
                <div className="card-body">
                    <div className="card-row">
                        <div className="card-col">
                            domain
                        </div>
                        <div className="card-col">
                            <input type="input" placeholder="https://example.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
                        </div>
                    </div>
                    <div className="card-row">
                        <div className="card-col">
                            username
                        </div>
                        <div className="card-col">
                            <input type="input" placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                    </div>
                    <div className="card-row">
                        <div className="card-col">
                            email
                        </div>
                        <div className="card-col">
                            <input type="email" placeholder="example@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className="card-row">
                        <div className="card-col">
                            password
                        </div>
                        <div className="card-col">
                            <input type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="card-row">
                        <div className="card-col">
                            notes
                        </div>
                        <div className="card-col">
                            <input type="input" placeholder="Your notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                        </div>
                    </div>
                    <div className="card-row">
                        <div className="card-col">
                            <button onClick={addNewRecord}>Add new record</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const Record = ({record, index}) => {
    const {user, addMsg, records, setRecords} = React.useContext(AppContext);
    const [domain, setDomain] = React.useState(record.data.domain);
    const [username, setUsername] = React.useState(record.data.username);
    const [email, setEmail] = React.useState(record.data.email);
    const [password, setPassword] = React.useState(record.data.password);
    const [notes, setNotes] = React.useState(record.data.notes);
    const [showPassword, setShowPassword] = React.useState(false);
    const [editable, setEditable] = React.useState(false);
    const [active, setActive] = React.useState(['edit']);
    //
    const deleteRecord = (e) => {
        e.preventDefault();
        db.collection(`users/${user.uid}/records`).doc(record.id).delete().then(() => {
            addMsg("Document successfully deleted!");
            setRecords(records => [...records].filter(r => r.id!==record.id));
        }).catch((error) => {
            addMsg("Error when removing document");
            addMsg(JSON.stringify(error, null, 4));
        });
    }
    return (
        <div className="card">
            <div className="card-header">
                <h1>Record #{index+1}</h1>
            </div>
            <div className="card-body">
                <div className="card-row">
                    <div className="card-col">
                        domain - {domain}
                    </div>
                    <div className="card-col">
                        {editable
                            ?<input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} />
                            :domain
                        }
                    </div>
                </div>
                <div className="card-row">
                    <div className="card-col">
                        username - {username}
                    </div>
                    <div className="card-col">
                        {editable
                            ?<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                            :username
                        }
                    </div>
                </div>
                <div className="card-row">
                    <div className="card-col">
                        email - {email}
                    </div>
                    <div className="card-col">
                        {editable
                            ?<input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                            :email
                        }
                    </div>
                </div>
                <div className="card-row">
                    <div className="card-col">
                        password - {password}
                    </div>
                    <div className="card-col">
                        <input type={showPassword?"text":"password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button onClick={() => setShowPassword(showPassword => !showPassword)}>toggle show password</button>
                        
                    </div>
                </div>
                <div className="card-row">
                    <div className="card-col">
                        notes - {notes}
                    </div>
                    <div className="card-col">
                        {editable
                            ?<input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
                            :notes
                        }
                    </div>
                </div>
                <div className="card-row">
                    <div className="card-col">
                        <button className={active.includes('edit')?'active':''} onClick={() => {
                            setEditable(true);
                            setActive(['ok', 'cancle']);
                        }}>Edit record</button>
                        <button className={active.includes('ok')?'active':''} onClick={() => {
                            // send update to server then
                            // setEditable(false);
                            // setActive(['edit']);
                        }}>OK</button>
                        <button className={active.includes('cancle')?'active':''} onClick={() => {
                            setEditable(false);
                            setActive(['edit']);
                        }}>Cancle</button>
                    </div>
                </div>
                <div className="card-row">
                    <div className="card-col">
                        <button onClick={deleteRecord}>Delete record</button>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

const ShowRecordSection = () => {
    const {records, setRecords} = React.useContext(AppContext);
    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h1>Show Record Section</h1>
                </div>
                <div className="card-body">
                    {records.map((record, index) =>
                        <Record
                            record={record}
                            index={index}
                            key={record.id}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

const SignupSigninSection = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const {user, addMsg, records, setRecords} = React.useContext(AppContext);

    const handleSignup = (e) => {
        e.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                addMsg(`You have been create a new user with enail = ${user.email} and uid = ${user.uid}`);
                // setUser(user) here!
            })
            .catch((error) => {
                addMsg('Can not create new user');
                addMsg(JSON.stringify(error, null, 4));
            });
    }

    const handleSignin = (e) => {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                const u = userCredential.user;
                addMsg(`You have been signed in with user = ${u.email} and uid = ${u.uid}`);
            })
            .catch((error) => {
                addMsg('Error when trying to sign in');
                addMsg(JSON.stringify(error, null, 4));
            });
    }

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h1>Show Record Section</h1>
                </div>
                <div className="card-body">
                    <div className="card-row">
                        <div className="card-col">
                            email
                        </div>
                        <div className="card-col">
                            <input type="email" placeholder="example@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className="card-row">
                        <div className="card-col">
                            password
                        </div>
                        <div className="card-col">
                            <input type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="card-row">
                        <div className="card-col">
                            <button onClick={handleSignup}>Signup</button>
                        </div>
                        <div className="card-col">
                            <button onClick={handleSignin}>Signin</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const AppContext = React.createContext();

const App = () => {
    const [user, setUser] = React.useState(null);
    const [messages, setMessages] = React.useState([]);
    const [records, setRecords] = React.useState([]);

    const addMsg = (msg) => {
        setMessages(messages => ([...messages, msg]))
    }

    React.useEffect(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            if(!user) {
                setUser(null);
                setRecords([]);
                return;
            }
            const email = user && user.email;
            const uid = user && user.uid;
            const displayName = user && user.displayName;
            const photoURL = user && user.photoURL;
            setUser(user => ({...user, email, uid, displayName, photoURL}));
        });
    }, [])

    const getRecords = async (e) => {
        if(!user) return;
        const records = [];
        await db.collection(`users/${user.uid}/records`).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                records.push({id: doc.id, data: doc.data()});
            });
        });
        setRecords(records);
    }

    React.useEffect(() => {
        getRecords();
    }, [user])

    const handleSignout = (e) => {
        e.preventDefault();
        firebase.auth().signOut().then(() => {
            addMsg(`signout succesfully`);
        }).catch((error) => {
            addMsg(`Error when signin out`);
            addMsg(JSON.stringify(error, null, 4));
        });
    }

    return (
        <AppContext.Provider value={{user, setUser, messages, setMessages, addMsg, records, setRecords}}>
            <LogSection />
            {!user && 
                <SignupSigninSection />
            }
            {user &&
                <>
                    <UserDetail />
                    <UpdateProfileSection />
                    <AddRecordSection />
                    <ShowRecordSection />
                    <button onClick={handleSignout}>Sign out</button>
                </>
            }
        </AppContext.Provider>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);