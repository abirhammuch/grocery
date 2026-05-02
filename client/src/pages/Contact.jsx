import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Contact = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
            
            <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Form */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Send us a message</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Name</label>
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-primary"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input 
                                type="email" 
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-primary"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Message</label>
                            <textarea 
                                rows="5"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-primary"
                                placeholder="Your message..."
                            ></textarea>
                        </div>
                        <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dull transition">
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Get in touch</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <FaPhone className="text-primary text-xl" />
                            <div>
                                <p className="font-semibold">Phone</p>
                                <p className="text-gray-600">+2 (51) 973-769-266</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaEnvelope className="text-primary text-xl" />
                            <div>
                                <p className="font-semibold">Email</p>
                                <p className="text-gray-600">abirhammuch@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaMapMarkerAlt className="text-primary text-xl" />
                            <div>
                                <p className="font-semibold">Address</p>
                                <p className="text-gray-600">123 Grocery Street, Bahir Dar City, Ethiopia</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaClock className="text-primary text-xl" />
                            <div>
                                <p className="font-semibold">Business Hours</p>
                                <p className="text-gray-600">Monday - Friday: 9am - 8pm</p>
                                <p className="text-gray-600">Saturday: 10am - 6pm</p>
                                <p className="text-gray-600">Sunday: Closed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;