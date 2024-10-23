import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useSession } from "next-auth/react";
import { getDashboard } from "@/store/dashboard/dashboard-slice";
import {IconArrowBack} from "@tabler/icons-react";
import Link from 'next/link';
import { Button } from '@mantine/core';
import store from "@/store/store";

const StaffProfile = () => {
    const [profile, setProfile] = useState({
        logo: '', 
        name: '',
        unitNumber: '',
        nId: '',
        birthDate: '',
        maritalStatus: '',
        nationality: '',
        gender: '',
        religion: '',
        language: '',
        medical: '',
        contactNumber: '',
        email: '',
        emergencyContact: '',
    });

    const [selectedMenu, setSelectedMenu] = useState('Personal Details');
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get('/api/user/profile');  
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();
    }, []);

    useEffect(() => {
        const params = {};
        params["accessToken"] = session?.user?.accessToken; 
        store.dispatch(getDashboard(params));
    }, [session]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updated Profile:', profile);
    };

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
    };

    return (
        <div className="w-full flex flex-col" style={{ backgroundColor: '#0E0631' }}>
            {/* Header */}
            <div className="text-center py-4" style={{ backgroundColor: '#0E0631',color:'#00FFFF' }}>
                <h1 className="text-2xl font-semibold">Profile Settings</h1>
            </div>
            <div style={{ position: 'absolute', top: '40px', right: '20px',color:'#00FFFF' }}>
                <Link href="/dashboard/tenant">
                    <Button leftIcon={<IconArrowBack size={18} />} size='xs' variant='outline'>Back</Button>
                </Link>
            </div>

            {/* Profile Content */}
            <div className="flex justify-between p-6">
                {/* Sidebar */}
                <div className="w-1/4 bg-white p-6 border-r border-gray-300" style={{ backgroundColor: '#00FFFF' }}>
                    <div className="text-center mb-6 relative">
                        <img
                            src={session?.user.logo} 
                            alt="Profile"
                            className="w-24 h-24 rounded-full mx-auto mb-4"
                        />
                        <h2 className="text-xl font-semibold text-blue-700">{session?.user.name}</h2> 
                    </div>

                    {/* Menu */}
                    <div className="flex flex-col space-y-3">
                        {['Personal Details', 'Contact Details', 'Emergency Contact', 'Change Password'].map(menu => (
                            <button
                                key={menu}
                                className={`py-2 px-4 text-left font-semibold ${selectedMenu === menu ? 'bg-blue-600 text-white' : 'bg-gray-100'} rounded`}
                                onClick={() => handleMenuClick(menu)}
                            >
                                {menu}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Profile Details Form */}
                <div className="w-3/4 bg-white p-6 rounded shadow min-h-[62vh]">
                    <form onSubmit={handleSubmit}>
                        {selectedMenu === 'Personal Details' && (
                            <>
                                {/* Personal Details Form */}
                                {/* Row 1 */}
                        <div className="grid grid-cols-2 gap-4 mb-4 ">
                            <div>
                                <label className="block mb-1 font-medium">Unit Number</label>
                                <input
                                    type="text"
                                    name="unitNumber"
                                    value={session?.user?.code}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    readOnly  
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={session?.user?.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    readOnly  
                                />
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-1 font-medium">National Id</label>
                                <input
                                    type="text"
                                    name="nationalId"
                                    value={session?.user?.nid}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    readOnly  
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Date of Birth</label>
                                <input
                                    type="date"  
                                    name="dateOfBirth"
                                    value={session?.user?.birthDate}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-1 font-medium">Marital Status</label>
                                <input
                                    type="text"
                                    name="maritalStatus"
                                    value={session?.user?.status}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Nationality</label>
                                <input
                                    type="text"
                                    name="nationality"
                                    value={session?.user?.nationality}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    
                                />
                            </div>
                        </div>

                        {/* Row 4 */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-1 font-medium">Gender</label>
                                <input
                                    type="text"
                                    name="gender"
                                    value={session?.user?.gender}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    readOnly  
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Religion</label>
                                <input
                                    type="text"
                                    name="religion"
                                    value={session?.user?.religion}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>

                        {/* Row 5 */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-1 font-medium">Language</label>
                                <input
                                    type="text"
                                    name="language"
                                    value={session?.user?.language}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Medical</label>
                                <input
                                    type="text"
                                    name="medical"
                                    value={session?.user?.medical}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                
                            </>
                        )}

                        {selectedMenu === 'Contact Details' && (
                            <>
                                {/* Contact Details Form */}
                                <div className="grid grid-cols-2 gap-4 mb-4 min-h-[61.5vh]">
                        <div>
                            <label className="block mb-1 font-medium">Contact Number</label>
                            <input
                                type="text"
                                name="contactNumber"
                                value={session?.user.phone}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={session?.user.email}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">County</label>
                            <input
                                type="text"
                                name="county"
                                value={session?.user.county} 
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={session?.user.address} 
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>

                                
                            </>
                        )}

                        {selectedMenu === 'Emergency Contact' && (
                            <>
                                {/* Emergency Contact Form */}
                                <div className="grid grid-cols-2 gap-4 mb-4 min-h-[61.5vh]">
                        <div>
                            <label className="block mb-1 font-medium">Emergency Contact</label>
                            <input
                                type="text"
                                name="emergencyContact"
                                value={profile.emergencyContact}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Relationship</label>
                            <input
                                type="text"
                                name="relationship"
                                value={profile.relationship}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Tel No</label>
                            <input
                                type="text"
                                name="telephoneNumber"
                                value={profile.telephoneNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={profile.address}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Remarks</label>
                            <textarea
                                name="remarks"
                                value={profile.remarks}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>

                            </>
                        )}

                        {selectedMenu === 'Change Password' && (
                            <>
                                {/* Change Password Form */}
                                <div className="flex justify-center items-center min-h-[64vh]">
                        <div className="grid grid-cols-1 gap-4 mb-4 w-full max-w-md">
                            <div>
                                <label className="block mb-1 font-medium">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                    </div>

                            </>
                        )}

                        <div className="text-center">
                            <button type="submit" className="px-6 py-2 bg-[#00FFFF] text-white font-medium rounded hover:bg-blue-600">Update</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StaffProfile;
