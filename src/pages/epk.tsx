import React, { useState } from 'react';
import { Download, ExternalLink, Mail, Instagram, Music, Image, Home } from 'lucide-react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { graphql, useStaticQuery } from "gatsby";

const HawnestEPK = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [mainPhoto, setMainPhoto] = useState(null);
    const [pressKitPhotos, setPressKitPhotos] = useState([]);

    const data = useStaticQuery(graphql`
         query {
           epk: allFile(filter: { sourceInstanceName: { eq: "epk" } }) {
             nodes {
               name
               childImageSharp {
                 gatsbyImageData(width: 400, placeholder: BLURRED)
               }
             }
           }
           presskit: allFile(filter: { sourceInstanceName: { eq: "presskit" } }) {
             nodes {
               name
               childImageSharp {
                 gatsbyImageData(width: 400, placeholder: BLURRED)
               }
             }
           }
         }
        `);

    React.useEffect(() => {
        const mainPhotoNode = data.epk.nodes.find(node => node.name === 'MAIN');
        setMainPhoto({ image: getImage(mainPhotoNode?.childImageSharp), name: mainPhotoNode?.name });
        let pressKitPhotoNodes = data.presskit.nodes.slice().sort((a, b) => parseInt(a.name) - parseInt(b.name));
        setPressKitPhotos(pressKitPhotoNodes.map(node => ({
            name: node.name,
            image: getImage(node.childImageSharp),
        })));
    }, [data])

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
                        <a href="mailto:hawnestmusic@gmail.com" className="hover:opacity-100 transition-opacity">hawnestmusic@gmail.com</a>
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
                            href="mailto:hawnestmusic@gmail.com"
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
                            {/* <div className="aspect-square bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center text-9xl font-light text-zinc-400">
                                R
                            </div> */}
                            <GatsbyImage image={mainPhoto?.image} alt={mainPhoto?.name} className="w-full h-auto" />
                        </div>

                        {/* Quick Info */}
                        <div className="w-full md:w-1/2 space-y-6">
                            <div>
                                <h2 className="text-xs tracking-wider opacity-60 mb-2">ARTIST NAME</h2>
                                <p className="text-3xl font-light tracking-wide">HAWNEST</p>
                            </div>

                            <div>
                                <h2 className="text-xs tracking-wider opacity-60 mb-2">GENRE</h2>
                                <p className="text-sm">Pop / R&B / Soul</p>
                            </div>

                            <div>
                                <h2 className="text-xs tracking-wider opacity-60 mb-2">LOCATION</h2>
                                <p className="text-sm">Kansas City, Missouri</p>
                            </div>

                            <div>
                                <h2 className="text-xs tracking-wider opacity-60 mb-2">LATEST RELEASE</h2>
                                <p className="text-sm">You Come Here Often? (EP, 2025)</p>
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
                                        href="https://music.apple.com/us/artist/hawnest/1842981468"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-1"
                                    >
                                        <Music className="w-3 h-3" />
                                        Apple Music
                                    </a>
                                    <a
                                        href="https://www.instagram.com/hawnest_"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-1"
                                    >
                                        <Instagram className="w-3 h-3" />
                                        Instagram
                                    </a>
                                    <a
                                        href="https://hawnest.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
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
                    <div className="space-y-4 text-sm leading-relaxed">
                        <p>
                            Hawnest is a Kansas City, Missouri based independent artist blending traditional songwriting with electronic production 
                            techniques. A self-proclaimed late bloomer, Hawnest began their musical journey at 23, after completing formal education 
                            and confronting an existential void. Starting with an acoustic guitar gifted by their late father and progressing into production work, 
                            Hawnest has sifted through years of musical exploration and is now ready to share a glimpse of their artistic evolution.
                        </p>
                        <p>
                            The debut EP, <i>You Come Here Often?</i> (2025), presents genre bending soundscapes inspired by early 2000s sampling, 
                            folk infused R&B, and indie pop. Each track is an exploration of modern relationships, both casual and romantic, through the
                            eyes of an introspective bystander who occasionally comes off the bench to participate. The project was recorded independently 
                            in Hawnest's studio apartment in North Kansas City, giving the EP a deeply personal and intimate sound.
                        </p>
                        <p>
                            Drawing inspiration from artists like Dijon, Bon Iver, Nourished By Time, and Frank Ocean, Hawnest is looking to continue
                            the sonic narrative these creatives have cultivated. To complement the music, Hawnest developed a web audio player <a href="https://hawnest.com" target="_blank">(https://hawnest.com)</a> that allows fans to remix and reimagine released 
                            and unreleased tracks. Users can tweak parameters such as tempo, pitch, reverb, delay, playback mode (forward/reverse), and stem isolation, 
                            creating a highly interactive listening experience. All commercially released music is available for playback via this web player.
                        </p>
                    </div>

                    {/* Short Bio */}
                    <div className="mt-8 p-6 bg-zinc-100/50 border border-black/5">
                        <h3 className="text-xs tracking-wider opacity-60 mb-3">SHORT BIO (100 WORDS)</h3>
                        <p className="text-sm leading-relaxed">
                            Hawnest is a Kansas City, Missouri based independent artist blending traditional songwriting with electronic production techniques
                            to contextualize modern relationships. The 2025 debut EP <i>You Come Here Often?</i> showcases genre bending soundscapes
                            accessible to casual listeners. Drawing inspiration from artists like Dijon, Bon Iver, Nourished By Time, and Frank Ocean, Hawnest looks to build upon
                            the sonic narrative these creatives have cultivated. To complement the music, Hawnest developed a web audio
                            player <a href="https://hawnest.com" target="_blank">(https://hawnest.com)</a> to expand upon both released and unreleased music. The player
                            allows users to remix and create new versions of their favorite songs.
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
                                <h3 className="text-2xl font-light tracking-wide mb-2">You Come Here Often?</h3>
                                <p className="text-xs tracking-wider opacity-60 mb-4">EP • 2025 • 4 TRACKS</p>
                                <p className="text-sm leading-relaxed mb-4">
                                    The debut EP, <i>You Come Here Often?</i> (2025), presents genre bending soundscapes inspired by early 2000s sampling, folk infused R&B, and indie pop. 
                                    Each track is an exploration of modern relationships, both casual and romantic, through the eyes of an introspective bystander who occasionally comes 
                                    off the bench to participate.
                                </p>
                                <div className="flex gap-2">
                                    <a
                                        href="https://open.spotify.com/artist/3h3LNc3azuPly6IhUnevmn"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-xs px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all "
                                    >
                                        SPOTIFY
                                    </a>
                                    <button className="text-xs px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all">
                                        DOWNLOAD PRESSKIT
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Track Highlights */}
                    <div>
                        <h3 className="text-xs tracking-wider opacity-60 mb-4">FEATURED TRACKS</h3>
                        <div className="space-y-3">
                            {['REGGIE', 'VINCE, BE COOL', 'OF LUV'].map((track, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 border border-black/10 hover:bg-black/[0.02] transition-colors">
                                    <div>
                                        <p className="text-sm font-medium">{track}</p>
                                        <p className="text-xs opacity-40">You Come Here Often? • 2025</p>
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
                        <a href="https://drive.google.com/file/d/1TpYadDPodQ2d0GeGyqyVy1z7kyDsZLNX/view?usp=sharing" target="_blank">
                            <button className="text-xs px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-2">
                                <Download className="w-3 h-3" />
                                DOWNLOAD ALL
                            </button>
                        </a>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {pressKitPhotos.map((photo) => (
                            <div key={photo.name} className="aspect-square flex items-center justify-center group cursor-pointer relative overflow-hidden">
                                <GatsbyImage image={photo.image} alt={photo.name} className="text-zinc-400 w-full h-auto" />
                                <a href={`/images/${photo.name}.jpg`} download>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <Download className="w-6 h-6 text-black" />
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs mt-4 opacity-40">
                        High-resolution images available for download. Photo Credit: Jake Wickersham <a href="https://www.jakewickersham.com" target="_blank">(https://www.jakewickersham.com)</a>
                    </p>
                </section>

                {/* Technical Requirements (for live shows) */}
                {/* Technical Requirements (for live shows) */}
                <section className="mb-16 pb-16 border-b border-black/10">
                    <h2 className="text-xs tracking-wider opacity-60 mb-6">TECHNICAL REQUIREMENTS</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="text-sm font-medium mb-3">STAGE SETUP</h3>
                            <ul className="text-sm space-y-2 opacity-80">
                                <li>• Minimum stage space: 16' x 12'</li>
                                <li>• 5 musicians: lead vocals/rhythm guitar, lead guitar, bass, drums, keys/sampler (all with backing vocals)</li>
                                <li>• Access to front-of-house mixing console</li>
                                <li>• 5 vocal microphones with stands</li>
                                <li>• 4 instrument microphones or DIs (for guitars, bass, keys, etc.)</li>
                                <li>• 4 monitor wedges (or individual IEM feeds if available)</li>
                                <li>• Power: minimum 6 grounded outlets (2 stage left, 2 stage right, 2 upstage center)</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-3">BACKLINE</h3>
                            <ul className="text-sm space-y-2 opacity-80">
                                <li>• Full drum kit (kick, snare, 3 toms, hi-hat, crash, ride) (or artist provided)</li>
                                <li>• Guitar amplifiers (x2) and bass amplifier</li>
                                <li>• Audio interface with minimum 4 outputs (artist provided)</li>
                                <li>• 3–4 DI boxes (for bass, synths, laptop playback)</li>
                                <li>• XLR cables for outputs to FOH</li>
                                <li>• Optional: small table for pedals or MIDI controllers</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-3">CHANNEL LIST</h3>
                            <ul className="text-sm space-y-2 opacity-80">
                                <li>1 – Kick</li>
                                <li>2 – Snare</li>
                                <li>3 – Overheads (L/R)</li>
                                <li>4 – Bass DI</li>
                                <li>5 – Rhythm Guitar</li>
                                <li>6 – Lead Guitar</li>
                                <li>7 – Keys/Synth L</li>
                                <li>8 – Keys/Synth R</li>
                                <li>9 – Sampler (stereo)</li>
                                <li>10 – Lead Vocal</li>
                                <li>11 – BV 1 (Guitar)</li>
                                <li>12 – BV 2 (Bass)</li>
                                <li>13 – BV 3 (Drums)</li>
                            </ul>
                        </div>
                    </div>
                </section>


                {/* Contact */}
                <section>
                    <h2 className="text-xs tracking-wider opacity-60 mb-6">CONTACT</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium mb-2">PRESS INQUIRIES / BOOKING / GENERAL</h3>
                            <p className="text-sm mb-1">Email: <a href="mailto:hawnestmusic@gmail.com" className="hover:opacity-60 transition-opacity">hawnestmusic@gmail.com</a></p>
                        </div>
                        {/* <div>
                            <h3 className="text-sm font-medium mb-2">BOOKING</h3>
                            <p className="text-sm mb-1">Email: <a href="mailto:hawnestmusic@gmail.com" className="hover:opacity-60 transition-opacity">hawnestmusic@gmail.com</a></p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-2">GENERAL</h3>
                            <p className="text-sm mb-1">Email: <a href="mailto:hawnestmusic@gmail.com" className="hover:opacity-60 transition-opacity">hawnestmusic@gmail.com</a></p>
                        </div> */}
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