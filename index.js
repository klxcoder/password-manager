const LogSection = () => {
    const {messages, setMessages} = React.useContext(AppContext);
    const clearLogs = (e) => {
        e.preventDefault();
        setMessages([]);
        swal("Good job!", "All logs cleared successfully!", "success");
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
                <button className="btn btn-secondary" onClick={clearLogs}>Clear all the logs</button>
            </div>
        </>
    )
}

const UserDetail = () => {
    const {user} = React.useContext(AppContext);
    return (
        <div className="container">
            <div className="mb-3">
                <h1>User's detail</h1>
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" placeholder="email@example.com" value={user.email} onChange={() => {}} disabled />
            </div>
            <div className="mb-3">
                <label htmlFor="uid" className="form-label">UID</label>
                <input type="text" className="form-control" id="uid" placeholder="uid" value={user.uid} onChange={() => {}} disabled />
            </div>
            <div className="mb-3">
                <label htmlFor="displayName" className="form-label">Display Name</label>
                <input type="text" className="form-control" id="displayName" placeholder="displayName" value={user.displayName} onChange={() => {}} disabled />
            </div>
        </div>
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
            swal("Good job!", "Update password successful.", "success");
        }).catch(function(error) {
            addMsg('Can not update password');
            addMsg(JSON.stringify(error, null, 4));
            swal("Ohh!", JSON.stringify(error, null, 4), "error");
        });
    }
    const updateDisplayName = (e) => {
        e.preventDefault();
        const user = firebase.auth().currentUser;
        const udate = {displayName};
        user.updateProfile(udate).then(function(x) {
            setUser(user => ({...user, ...udate}));
            addMsg('Update profile successful.');
            swal("Good job!", "Update displayName successful.", "success");
        }).catch(function(error) {
            addMsg('Can not update profile');
            addMsg(JSON.stringify(error, null, 4));
            swal("Ohh!", JSON.stringify(error, null, 4), "error");
        });
    }
    const sendEmailVerification = (e) => {
        e.preventDefault();
        const user = firebase.auth().currentUser;
        user.sendEmailVerification().then(function() {
            addMsg('Email verification sent.');
            swal("Good job!", 'Email verification sent.', "success");
        }).catch(function(error) {
            addMsg('Cant not send email verification');
            addMsg(JSON.stringify(error, null, 4));
            swal("Ohh!", JSON.stringify(error, null, 4), "error");
        });
    }
    return (
        <>
            <h1>Update Profile Section</h1>
            <div className="d-flex justify-content-center">
                <div className="border border-primary rounded m-1 p-1 d-flex flex-column align-items-center">
                    <div className="m-1 d-flex">
                        <input className="flex-fill" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button className="btn btn-secondary" onClick={updatePassword}>Update</button>
                    </div>
                    <div className="m-1 d-flex">
                        <input className="flex-fill" type="input" placeholder="Your displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                        <button className="btn btn-secondary" onClick={updateDisplayName}>Update</button>
                    </div>
                    <div>
                        <button className="col btn btn-secondary" onClick={sendEmailVerification}>Send Email Verification</button>
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
    const {user, addMsg, setRecords} = React.useContext(AppContext);
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
            swal("Good job!", "Document is created succesfully", "success");
            setRecords(records => [...records, {data: newRecordData, id: docRef.id}]);
            setDomain('');
            setUsername('');
            setEmail('');
            setPassword('');
            setNotes('');
        })
        .catch((error) => {
            addMsg("Error adding document");
            addMsg(JSON.stringify(error, null, 4));
            swal("Ohh!", JSON.stringify(error, null, 4), "error");
        });
    }

    // React.useEffect(() => {
        console.log('render AddRecordSection');
    // }, [])

    return (
        <div className="container">
            <div className="mb-3">
                <h1>Add Record Section</h1>
            </div>
            <div className="mb-3">
                <label htmlFor="domain" className="form-label">Domain</label>
                <input type="text" className="form-control" id="domain" placeholder="https://example.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" className="form-control" id="username" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" placeholder="example@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="notes" className="form-label">Notes</label>
                <textarea className="form-control" id="notes" rows="3" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
            </div>
            <div className="mb-3">
                <button className="btn btn-primary" onClick={addNewRecord}>Add new record</button>
            </div>
        </div>
    )
}

const Record = ({record, index}) => {
    const {user, addMsg, setRecords} = React.useContext(AppContext);
    const [domain, setDomain] = React.useState(record.data.domain);
    const [username, setUsername] = React.useState(record.data.username);
    const [email, setEmail] = React.useState(record.data.email);
    const [password, setPassword] = React.useState(record.data.password);
    const [notes, setNotes] = React.useState(record.data.notes);
    const [showPassword, setShowPassword] = React.useState(false);
    
    const deleteRecord = (e) => {
        e.preventDefault();
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                db.collection(`users/${user.uid}/records`).doc(record.id).delete().then(() => {
                    addMsg("Document successfully deleted!");
                    swal("Poof! Your record file has been deleted!", {icon: "success",});
                    setRecords(records => [...records].filter(r => r.id!==record.id));
                }).catch((error) => {
                    addMsg("Error when removing document");
                    addMsg(JSON.stringify(error, null, 4));
                    swal("Ohh!", JSON.stringify(error, null, 4), "error");
                });
            } else {
                swal("Your imaginary file is safe!");
            }
        });
    }

    const copyPassword = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(password)
            .then(() => {
                addMsg('Copied password to the clipboard');
                swal("Good job!", "Password coppied", "success");
            })
            .catch(error => {
                addMsg("Error when copying password");
                addMsg(JSON.stringify(error, null, 4));
                swal("Ohh!", JSON.stringify(error, null, 4), "error");
            });
    }

    const saveRecord = (e) => {
        e.preventDefault();

        const editedRecordData = {
            domain,
            username,
            email,
            password,
            notes,
        }

        db.collection(`users/${user.uid}/records`).doc(record.id).set(editedRecordData)
        .then(() => {
            addMsg("Document successfully updated!");
            swal("Good job!", "Record saved", "success");
            setRecords(records => [...records].map(r => {
                if(r.id !== record.id) return r;
                return {
                    id: record.id,
                    data: editedRecordData
                }
            }))
        })
        .catch((error) => {
            addMsg("Error when removing document");
            addMsg(JSON.stringify(error, null, 4));
            swal("Ohh!", JSON.stringify(error, null, 4), "error");
        });
    }

    return (
        <div className="container border border-primary rounded m-3" >
            <div className="mb-3">
                <h1>Record #{index+1}</h1>
            </div>
            <div className="mb-3">
                <label htmlFor="domain" className="form-label">Domain</label>
                <input type="text" className="form-control" id="domain" placeholder="https://example.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" className="form-control" id="username" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" placeholder="example@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type={showPassword ? "text" : "password"} className="form-control" id="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="mb-3">
                <button className="btn btn-secondary" onClick={() => setShowPassword(showPassword => !showPassword)}>Show password</button>
            </div>
            <div className="mb-3">
                <button className="btn btn-secondary" onClick={copyPassword}>Copy password to clipboard</button>
            </div>
            <div className="mb-3">
                <label htmlFor="notes" className="form-label">Notes</label>
                <textarea className="form-control" id="notes" rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="mb-3">
                <button className="btn btn-primary" onClick={saveRecord}>Save record</button>
            </div>
            <div className="mb-3">
                <button className="btn btn-secondary" onClick={deleteRecord}>Delete record</button>
            </div>
        </div>
    )
}

const ShowRecordSection = () => {
    const {records} = React.useContext(AppContext);
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
    const {addMsg, setTab} = React.useContext(AppContext);

    const handleSignup = (e) => {
        e.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                addMsg(`You have been create a new user with enail = ${user.email} and uid = ${user.uid}`);
                swal("Good job!", "Sign up successfully", "success");
                // setUser(user) here!
            })
            .catch((error) => {
                addMsg('Can not create new user');
                addMsg(JSON.stringify(error, null, 4));
                swal("Ohh!", JSON.stringify(error, null, 4), "error");
            });
    }

    const handleSignin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            // Signed in
            const u = userCredential.user;
            addMsg(`You have been signed in with user = ${u.email} and uid = ${u.uid}`);
            setTab('/');
            swal("Good job!", "Sign in successfully!", "success");
        } catch(error) {
            addMsg('Error when trying to sign in');
            addMsg(JSON.stringify(error, null, 4));
            swal("Ohh!", JSON.stringify(error, null, 4), "error");
        }
    }

    return (
        <div className="container">
            <div className="mb-3">
                <h1>Sign in & Sign up</h1>
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-primary" onClick={handleSignin}>Sign in</button>
                </div>
                <div className="col">
                    <button className="btn btn-secondary" onClick={handleSignup}>Sign up</button>
                </div>
            </div>
        </div>
    )
}

const Header = () => {
    const {tab, setTab, user} = React.useContext(AppContext);
    const handleSetTab = (e, value) => {
        e.preventDefault();
        setTab(value);
    }

    const handleSignout = (e) => {
        e.preventDefault();
        firebase.auth().signOut().then(() => {
            addMsg(`signout succesfully`);
            swal("Good job!", "Sign out successfully!", "success");
        }).catch((error) => {
            addMsg(`Error when signin out`);
            addMsg(JSON.stringify(error, null, 4));
            swal("Ohh!", JSON.stringify(error, null, 4), "error");
        });
    }

    return (
        <>
            <div className="d-flex p-2 bd-highlight justify-content-between">
                <div>{tab==='/'?tab:`/${tab}`}</div>
                {user && <button className="btn btn-secondary" onClick={handleSignout}>Sign out</button>}
            </div>
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">Navbar</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                                    <button className={tab==="/" ? "nav-link active" : "nav-link"} onClick={(e) => handleSetTab(e, '/')}>Home</button>
                                </li>
                                <li className="nav-item" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                                    <button className={tab==="log" ? "nav-link active" : "nav-link"} onClick={(e) => handleSetTab(e, 'log')}>Log Section</button>
                                </li>
                                {!user &&
                                    <>
                                        <li className="nav-item" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                                            <button className={tab==="sign"?"nav-link active":"nav-link"} onClick={(e) => handleSetTab(e, 'sign')}>Sign in & Sign up</button>
                                        </li>
                                    </>
                                }
                                {user &&
                                    <>
                                        {[
                                            {
                                                tab: 'user-detail',
                                                text: 'User Detail Section'
                                            },
                                            {
                                                tab: 'update-profile',
                                                text: 'User Profile Section'
                                            },
                                            {
                                                tab: 'add-record',
                                                text: 'Add Record Section'
                                            },
                                            {
                                                tab: 'show-record',
                                                text: 'Show Record Section'
                                            }
                                        ].map(x =>
                                            <li className="nav-item" data-bs-toggle="collapse" data-bs-target="#navbarNav" key={x.tab}>
                                                <button className={tab===x.tab?"nav-link active":"nav-link"} onClick={(e) => handleSetTab(e, x.tab)}>{x.text}</button>
                                            </li>    
                                        )}
                                    </>
                                }
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    )
}

const Body = () => {
    const {tab, user} = React.useContext(AppContext);
    return (
        <div>
            {tab==='/' && <h1>Home Page</h1>}
            {tab==='log' && <LogSection />}
            {!user && tab==='sign' && <SignupSigninSection />}
            {user &&
                <>
                    {tab==='user-detail' && <UserDetail />}
                    {tab==='update-profile' && <UpdateProfileSection />}
                    {tab==='add-record' && <AddRecordSection />}
                    {tab==='show-record' && <ShowRecordSection />}
                </>
            }
        </div>
    )
}

const AppContext = React.createContext();

const App = () => {
    const [user, setUser] = React.useState(null);
    const [messages, setMessages] = React.useState([]);
    const [records, setRecords] = React.useState([]);
    const [tab, setTab] = React.useState('/');

    const addMsg = (msg) => {
        setMessages(messages => ([...messages, msg]));
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

    return (
        <AppContext.Provider value={{user, setUser, messages, setMessages, addMsg, records, setRecords, tab, setTab}}>
            <Header />
            <Body />
        </AppContext.Provider>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);