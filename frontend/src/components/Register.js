import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './website/Header';
import Footer from './website/Footer';
import '../assets/home.css';

function Register() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // Error message
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation
        if (!name || !email || !password) {
            setMessage('All fields are required');
            return;
        }

        const userData = { name, email, password };

        try {
            const response = await axios.post('http://localhost:5000/api/register', userData);
            
            if (response.status === 201) {
                setMessage('Registration successful!');
                setTimeout(() => {
                    navigate('/login'); // Redirect to login after successful registration
                }, 2000);
            } else {
                setMessage(response.data.message || 'Registration failed');
            }
        } catch (error) {
            // Display error message from the backend
            const errorMessage = error.response?.data?.message || 'An error occurred during registration';
            setMessage(errorMessage);
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8 col-sm-10">
                        <div className="card shadow-lg rounded">
                            <div className="card-body">
                                <h2 className="text-center mb-4">Register</h2>
                                {/* Display the error message */}
                                {message && <div className={`alert alert-${message === 'Registration successful!' ? 'success' : 'danger'}`}>{message}</div>}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100 py-2 mt-4">Register</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Register;
