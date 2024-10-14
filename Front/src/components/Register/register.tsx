"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
        }
        try {
        const response = await axios.post('/api/register', { name, email, password });
        console.log(response.data);
        router.push("/login")
        // Redirigir al login o dashboard
        } catch (err) {
        setError('Error al registrar. Intenta de nuevo.');
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">
        <form onSubmit={handleRegister} className="w-full max-w-sm bg-white shadow-md rounded px-8 py-6">
            <h2 className="text-2xl font-bold text-center text-[var(--primary)]">Register</h2>
            <div className="mb-4">
            <label htmlFor="name" className="block text-[black] text-sm font-bold mb-2">Nombre</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
            <label htmlFor="email" className="block text-[black] text-sm font-bold mb-2">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
            <label htmlFor="password" className="block text-[black] text-sm font-bold mb-2">Contraseña</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-[black] text-sm font-bold mb-2">Confirmar Contraseña</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 border rounded" />
            </div>
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
            <button type="submit" className="primary-btn w-full py-2 mt-4">Registrarse</button>
        </form>
        </div>
    );
};

export default Register;
