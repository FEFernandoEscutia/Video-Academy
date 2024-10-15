"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        const response = await axios.post('/api/login', { email, password });
        console.log(response.data);
        router.push('/')
        // Redirigir a la página principal o dashboard
        } catch (err) {
        setError('Email o contraseña incorrectos');
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white shadow-md rounded px-8 py-6">
            <h2 className="text-2xl font-bold text-center text-[var(--primary)]">Login</h2>
            <div className="mb-4">
            <label htmlFor="email" className="block text-black text-sm font-bold mb-2">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
            <label htmlFor="password" className="block text-black text-sm font-bold mb-2">Contraseña</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded" />
            </div>
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
            <button type="submit" className="primary-btn w-full py-2 mt-4">Iniciar sesión</button>
        </form>
        </div>
    );
};

export default Login;
