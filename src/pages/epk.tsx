import React, { useState } from 'react';
import { Download, ExternalLink, Mail, Instagram, Music, Image, Home } from 'lucide-react';

const HawnestEPK = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Simple password protection - in production, use proper authentication
    const correctPassword = 'hawnest2025';

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === correctPassword) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };

    // Password gate
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-light tracking-wider mb-2">HAWNEST</h1>
                        <p className="text-sm tracking-wider opacity-60">ELECTRONIC PRESS KIT</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs tracking-wider opacity-60 mb-2">PASSWORD</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit(e)}
                                className="w-full px-4 py-3 border border-black/10 focus:border-black/30 outline-none transition-colors"
                                placeholder="Enter access code"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-red-600">{error}</p>
                        )}

                        <button
                            onClick={handlePasswordSubmit}
                            className="w-full px-4 py-3 bg-black text-white text-xs tracking-wider hover:bg-black/80 transition-colors"
                        >
                            ACCESS EPK
                        </button>
                    </div>

                    <p className="text-xs text-center opacity-40 mt-8">
                        This is a private press kit. If you need access, please contact:<br />
                        <a href="mailto:press@hawnest.com" className="hover:opacity-100 transition-opacity">press@hawnest.com</a>
                    </p>
                </div>
            </div>
        );
    }

    // Main EPK content
    return (
        <div className="min-h-screen bg-zinc-50 text-black">
            {/* Header */}
            <header className="border-b border-black/10 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl tracking-wider">HAWNEST</h1>
                        <p className="text-xs tracking-wider opacity-40">ELECTRONIC PRESS KIT</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href="mailto:press@hawnest.com"
                            className="text-xs tracking-wider px-4 py-2 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-2"
                        >
                            <Mail className="w-3 h-3" />
                            CONTACT
                        </a>
                        <a
                            href="/"
                            className="text-xs tracking-wider px-4 py-2 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-2"
                        >
                            <Home className="w-3 h-3" />
                            HOME
                        </a>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <section className="mb-16">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Main Press Photo */}
                        <div className="w-full md:w-1/2">
                            <div className="aspect-square bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center text-9xl font-light text-zinc-400">
                                R
                            </div>
                            <p className="text-xs mt-2 opacity-40">Press photo placeholder - replace with actual image</p>
                        </div>

                        {/* Quick Info */}
                        <div className="w-full md:w-1/2 space-y-6">
                            <div>
                                <h2 className="text-xs tracking-wider opacity-60 mb-2">ARTIST NAME</h2>
                                <p className="text-3xl font-light tracking-wide">HAWNEST</p>
                            </div>

                            <div>
                                <h2 className="text-xs tracking-wider opacity-60 mb-2">GENRE</h2>
                                <p className="text-sm">Experimental Electronic / Ambient / Soundscapes</p>
                            </div>

                            <div>
                                <h2 className="text-xs tracking-wider opacity-60 mb-2">LOCATION</h2>
                                <p className="text-sm">Kansas City, Missouri</p>
                            </div>

                            <div>
                                <h2 className="text-xs tracking-wider opacity-60 mb-2">LATEST RELEASE</h2>
                                <p className="text-sm">REGGIE (Album, 2025)</p>
                            </div>

                            {/* Social Links */}
                            <div>
                                <h2 className="text-xs tracking-wider opacity-60 mb-3">LINKS</h2>
                                <div className="flex flex-wrap gap-2">
                                    <a
                                        href="https://open.spotify.com/artist/3h3LNc3azuPly6IhUnevmn"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-1"
                                    >
                                        <Music className="w-3 h-3" />
                                        Spotify
                                    </a>
                                    <a
                                        href="#"
                                        className="text-xs px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-1"
                                    >
                                        <Music className="w-3 h-3" />
                                        Apple Music
                                    </a>
                                    <a
                                        href="#"
                                        className="text-xs px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-1"
                                    >
                                        <Instagram className="w-3 h-3" />
                                        Instagram
                                    </a>
                                    <a
                                        href="#"
                                        className="text-xs px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-1"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Website
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Biography */}
                <section className="mb-16 pb-16 border-b border-black/10">
                    <h2 className="text-xs tracking-wider opacity-60 mb-6">BIOGRAPHY</h2>
                    <div className="space-y-4 text-sm leading-relaxed max-w-3xl">
                        <p>
                            Hawnest is an independent artist exploring the intersection of sound, technology, and natural aesthetics.
                            Based in Kansas City, Missouri, the project represents a unique approach to modern music production that
                            pushes boundaries while maintaining an organic, earth-rooted sensibility.
                        </p>
                        <p>
                            The debut album "REGGIE" (2025) showcases Hawnest's signature sound: experimental electronic textures
                            layered with ambient soundscapes and carefully crafted audio manipulation. Each track serves as an
                            exploration of sonic possibilities, utilizing advanced production techniques including stem isolation,
                            real-time effects processing, and looping mechanics.
                        </p>
                        <p>
                            Drawing inspiration from the natural world while embracing cutting-edge technology, Hawnest creates
                            immersive audio experiences that challenge traditional genre boundaries. The project represents a
                            forward-thinking approach to independent music in the digital age.
                        </p>
                    </div>

                    {/* Short Bio */}
                    <div className="mt-8 p-6 bg-zinc-100/50 border border-black/5">
                        <h3 className="text-xs tracking-wider opacity-60 mb-3">SHORT BIO (100 WORDS)</h3>
                        <p className="text-sm leading-relaxed">
                            Hawnest is a Kansas City-based experimental electronic artist blending ambient soundscapes with
                            innovative production techniques. The 2025 debut album "REGGIE" showcases a unique approach to
                            modern music-making, featuring stem isolation, real-time effects, and organic textures. Drawing
                            from both natural and technological influences, Hawnest creates immersive audio experiences that
                            push the boundaries of contemporary electronic music while maintaining an accessible, earth-toned
                            aesthetic.
                        </p>
                    </div>
                </section>

                {/* Music Section */}
                <section className="mb-16 pb-16 border-b border-black/10">
                    <h2 className="text-xs tracking-wider opacity-60 mb-6">MUSIC</h2>

                    {/* Featured Release */}
                    <div className="mb-8">
                        <div className="flex gap-6 items-start mb-4">
                            <div className="w-32 h-32 bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center text-4xl font-light text-zinc-400 flex-shrink-0">
                                R
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-light tracking-wide mb-2">REGGIE</h3>
                                <p className="text-xs tracking-wider opacity-60 mb-4">ALBUM • 2025 • 9 TRACKS</p>
                                <p className="text-sm leading-relaxed mb-4">
                                    The debut album from Hawnest explores experimental electronic production through nine carefully
                                    crafted tracks. Each song showcases advanced audio manipulation techniques while maintaining
                                    organic, natural aesthetics.
                                </p>
                                <div className="flex gap-2">
                                    <a
                                        href="https://open.spotify.com/artist/3h3LNc3azuPly6IhUnevmn"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs px-3 py-1.5 bg-black text-white rounded-full hover:bg-black/80 transition-all"
                                    >
                                        LISTEN ON SPOTIFY
                                    </a>
                                    <button className="text-xs px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all">
                                        DOWNLOAD PRESS MATERIALS
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Track Highlights */}
                    <div>
                        <h3 className="text-xs tracking-wider opacity-60 mb-4">FEATURED TRACKS</h3>
                        <div className="space-y-3">
                            {['PLATINUM', 'EXTREMES', 'JAKS'].map((track, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 border border-black/10 hover:bg-black/[0.02] transition-colors">
                                    <div>
                                        <p className="text-sm font-medium">{track}</p>
                                        <p className="text-xs opacity-40">REGGIE • 2025</p>
                                    </div>
                                    <button className="text-xs px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all">
                                        STREAM
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Press Photos */}
                <section className="mb-16 pb-16 border-b border-black/10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xs tracking-wider opacity-60">PRESS PHOTOS</h2>
                        <button className="text-xs px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-2">
                            <Download className="w-3 h-3" />
                            DOWNLOAD ALL
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-square bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center group cursor-pointer relative overflow-hidden">
                                <Image className="w-12 h-12 text-zinc-400" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <Download className="w-6 h-6 text-black" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs mt-4 opacity-40">
                        High-resolution images available for download. Photo credit: [Photographer Name]
                    </p>
                </section>

                {/* Technical Requirements (for live shows) */}
                <section className="mb-16 pb-16 border-b border-black/10">
                    <h2 className="text-xs tracking-wider opacity-60 mb-6">TECHNICAL REQUIREMENTS</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium mb-3">STAGE SETUP</h3>
                            <ul className="text-sm space-y-2 opacity-80">
                                <li>• Audio interface with minimum 4 outputs</li>
                                <li>• Quality monitoring system</li>
                                <li>• Dedicated mixing console access</li>
                                <li>• Stage space: 10' x 10' minimum</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-3">BACKLINE</h3>
                            <ul className="text-sm space-y-2 opacity-80">
                                <li>• MIDI controller (provided by artist)</li>
                                <li>• Laptop stand</li>
                                <li>• Power outlets: 2 minimum</li>
                                <li>• XLR cables for output</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section>
                    <h2 className="text-xs tracking-wider opacity-60 mb-6">CONTACT</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium mb-2">PRESS INQUIRIES</h3>
                            <p className="text-sm mb-1">Email: <a href="mailto:press@hawnest.com" className="hover:opacity-60 transition-opacity">press@hawnest.com</a></p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-2">BOOKING</h3>
                            <p className="text-sm mb-1">Email: <a href="mailto:booking@hawnest.com" className="hover:opacity-60 transition-opacity">booking@hawnest.com</a></p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-2">GENERAL</h3>
                            <p className="text-sm mb-1">Email: <a href="mailto:contact@hawnest.com" className="hover:opacity-60 transition-opacity">contact@hawnest.com</a></p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-2">MANAGEMENT</h3>
                            <p className="text-sm mb-1">Currently self-managed</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-black/10 mt-16">
                <div className="max-w-5xl mx-auto px-6 py-8 text-xs text-center opacity-40">
                    <p>© 2025 Hawnest • All Rights Reserved</p>
                    <p className="mt-2">This electronic press kit is for media and promotional use only.</p>
                </div>
            </footer>
        </div>
    );
};

export default HawnestEPK;