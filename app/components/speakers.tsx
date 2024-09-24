export const FeaturedSpeakers = () => {

    // Static list of speakers. In the future this might be server routed and fetched from a database.
    const speakers = [
        { name: 'A.W. Tozer', icon: 'app/assets/speakers/awtozer.webp' },
        { name: 'Alan Redpath', icon: 'app/assets/speakers/alanredpath.webp' },
        { name: 'Art Katz', icon: 'app/assets/speakers/artkatz.webp' },
        { name: 'Bakht Singh', icon: 'app/assets/speakers/bakhtsinghsm.webp' },
        { name: 'Bill McLeod', icon: 'app/assets/speakers/billmcleod.webp' },
        { name: 'Carter Conlon', icon: 'app/assets/speakers/carterconlon.webp' },
        { name: 'Chuck Smith', icon: 'app/assets/speakers/chucksmith.webp' },
        { name: 'Corrie Ten Boom', icon: 'app/assets/speakers/corrietenboom.webp' },
        // ... add more speakers
    ];

    return (
        <div className="mx-auto max-w-7xl p-4 bg-white border-b-2 border-[#707032] rounded-lg mt-44 px-8">
            <div className="flex flex-wrap justify-center">
                {speakers.map((speaker, index) => (
                    <div key={index} className="flex flex-col items-center m-2">
                        <img src={speaker.icon} alt={speaker.name} className="w-16 h-16 rounded-full" />
                        <p className="text-center mt-2 text-sm">{speaker.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};