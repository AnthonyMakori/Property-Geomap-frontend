import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useSession } from "next-auth/react";
import { getDashboard } from "@/store/dashboard/dashboard-slice";
import {IconArrowBack} from "@tabler/icons-react";
import Link from 'next/link';
import { Button, TextInput } from '@mantine/core';
import store from "@/store/store";


const TenantProfile = () => {
    const [user, setProfile] = useState({
        logo: '', 
        name: '',
        unitNumber: '',
        nId: '',
        dateOfBirth: '',
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
        console.log('Updated Profile:', user);
    };

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
    };
    const PasswordForm = ({ handleInputChange }) => {
        const [showPassword, setShowPassword] = useState(false);
    
        const toggleShowPassword = () => {
            setShowPassword((prevState) => !prevState);
        };
    }

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
                <div className="w-3/4 bg-white p-6 rounded shadow min-h-[77.5vh]">
                    <form onSubmit={handleSubmit}>
                        {selectedMenu === 'Personal Details' && (
                            <>
                                {/* Personal Details Form */}
                                {/* Row 1 */}
                        <div className="grid grid-cols-2 gap-4 mb-4 ">
                            <div>
                               
                                <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Unit Number"
                                    type="text"
                                   
                                    value={session?.user?.code}
                                    onChange={handleInputChange}
                                   
                                    readOnly  
                                />
                            </div>
                            <div>
                                
                                <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Name"
                                    type="text"
                                   
                                    value={session?.user?.name}
                                    onChange={handleInputChange}
                                   // className="w-full p-2 border rounded"
                                    readOnly  
                                />
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                
                                <TextInput
                                className="w-full sm:w-auto"
                                placeholder="National Id"
                                    type="text"
                                    value={session?.user?.nid}
                                    onChange={handleInputChange}
                                    readOnly  
                                />
                            </div>
                            <div>
                               
                                <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Date of Birth"
                                    type="date"
                                    value={session?.user?.birthDate}
                                    onChange={handleInputChange}

                                />
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                               
                                <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Marital Status"
                                    type="text"
                                    value={session?.user?.maritalStatus }
                                    onChange={handleInputChange}
                                    readOnly  
                                />
                            </div>
                            <div>
                               
                                <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Nationality"
                                    type="text" 
                                    value={session?.user?.nationality}
                                    onChange={handleInputChange}
                                    readOnly  
                                />
                            </div>
                        </div>

                        {/* Row 4 */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                
                                <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Gender"
                                    type="text"
                                    value={session?.user?.gender}
                                    onChange={handleInputChange}
                                    readOnly  
                                />
                            </div>
                            <div>
                               
                                <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Occupation"
                                    type="text"
                                    value={session?.user?.occupation}
                                    onChange={handleInputChange}
                                    readOnly  
                                />
                            </div>
                        </div>

                        {/* Row 5 */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                
                                <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Language"
                                    type="text"
                                    value={session?.user?.language}
                                    onChange={handleInputChange}
                                    readOnly  
                                />
                            </div>
                            <div>
                                
                                <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Medical"
                                    type="text"
                                    value={session?.user?.medical}
                                    onChange={handleInputChange}
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
                           
                            <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Contact Number"
                                    type="text"
                                    value={session?.user?.phone}
                                    onChange={handleInputChange}
                                  
                                />
                        </div>
                        <div>
                            
                            <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Email"
                                    type="text"
                                    value={session?.user?.email}
                                    onChange={handleInputChange}
                                   
                                    
                                />
                        </div>
                        <div>
                            
                            <TextInput
                                className="w-full sm:w-auto"
                                placeholder="County"
                                    type="text"
                                    value={session?.user?.county}
                                    onChange={handleInputChange}
                                   
                                     
                                />
                        </div>
                        <div>
                          
                            <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Address"
                                    type="text"
                                    value={session?.user?.address}
                                    onChange={handleInputChange}
                                   
                                    
                                />
                        </div>
                    </div>

                                
                            </>
                        )}

                        {selectedMenu === 'Emergency Contact' && (
                            <>
                                {/* Emergency Contact Form */}
                                <div className="grid grid-cols-2 gap-4 mb-2 min-h-[61.5vh]">
                                    <div>
                                        
                                        <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Name"
                                    type="text"
                                    value={session?.user?.name}
                                    onChange={handleInputChange}
                                   
                                />
                                    </div>
                                    <div>
                                       
                                        <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Relationship"
                                    type="text"
                                    value={session?.user?.relationship}
                                    onChange={handleInputChange}
                                   
                                />
                                    </div>
                                    <div>
                                       
                                        <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Tel No"
                                    type="text"
                                    value={session?.user?.phone}
                                    onChange={handleInputChange}
                                   
                                />
                                    </div>
                                    <div>
                                        
                                        <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Email"
                                    type="text"
                                    value={session?.user?.email}
                                    onChange={handleInputChange}
                                   
                                />
                                    </div>
                                    <div>
                                        
                                        <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Address"
                                    type="text"
                                    value={session?.user?.address}
                                    onChange={handleInputChange}
                                />
                                    </div>
                                    <div>
                                       
                                        <TextInput
                                className="w-full sm:w-auto"
                                placeholder="Remarks"
                                    type="text"
                                    value={""}
                                    onChange={handleInputChange}
                                   
                                />
                                    </div>
                                </div>

                            </>
                        )}

                        {selectedMenu === 'Change Password' && (
                            <>
                                {/* Change Password Form */}
                               <div className="flex flex-col items-center space-y-8">
                                    <TextInput
                                        className="w-full sm:w-[32rem]" 
                                        placeholder="Current password"
                                        type="text"
                                        onChange={handleInputChange}
                                    />
                                    <TextInput
                                        className="w-full sm:w-[32rem]"
                                        placeholder="New password"
                                        type="text"
                                        onChange={handleInputChange}
                                    />
                                    <TextInput
                                        className="w-full sm:w-[32rem]"
                                        placeholder="Confirm password"
                                        type="text"
                                        onChange={handleInputChange}
                                    />
                                </div>


                                </>
                            )}
                      <div className="fixed bottom-10 right-10">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#00FFFF] text-white font-medium rounded hover:bg-blue-600"
                        >
                            Update
                        </button>
                    </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default TenantProfile;    
                       

                        
