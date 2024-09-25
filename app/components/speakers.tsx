export const FeaturedSpeakers = () => {

  // Static list of speakers. In the future this might be server routed and fetched from a database.
  const speakers = [
    {name: 'A.W. Tozer', icon: 'app/assets/speakers/awtozer.webp'},
    {name: 'Alan Redpath', icon: 'app/assets/speakers/alanredpath.webp'},
    {name: 'Art Katz', icon: 'app/assets/speakers/artkatz.webp'},
    {name: 'Bakht Singh', icon: 'app/assets/speakers/bakhtsinghsm.webp'},
    {name: 'Bill McLeod', icon: 'app/assets/speakers/billmcleod.webp'},
    {name: 'Carter Conlon', icon: 'app/assets/speakers/carterconlon.webp'},
    {name: 'Chuck Smith', icon: 'app/assets/speakers/chucksmith.webp'},
    {name: 'Corrie Ten Boom', icon: 'app/assets/speakers/corrietenboom.webp'},
    {name: 'David Wilkerson', icon: 'app/assets/speakers/davidwilkerson.webp'},
    {name: 'Duncan Campbell', icon: 'app/assets/speakers/duncancambell.webp'},
    {name: 'Erlo Stegen', icon: 'app/assets/speakers/erlostegen.webp'},
    {name: 'George Verwer', icon: 'app/assets/speakers/georgeverwer.webp'},
    {name: 'George Warnock', icon: 'app/assets/speakers/warnock.webp'},
    {name: 'Hans R. Waldvogel', icon: 'app/assets/speakers/hansrwaldvogel.webp'},
    {name: 'J. Edwin Orr', icon: 'app/assets/speakers/jedwinorr.webp'},
    {name: 'J. Glyn Owen', icon: 'app/assets/speakers/jglynowen.webp'},
    {name: 'J. Vernon McGee', icon: 'app/assets/speakers/jvernonmcgee.webp'},
    {name: 'Jackie Pullinger', icon: 'app/assets/speakers/jackiepullinger.webp'},
    {name: 'Jim Cymbala', icon: 'app/assets/speakers/jimcymbala.webp'},
    {name: 'Keith Daniel', icon: 'app/assets/speakers/keithdaniel.webp'},
    {name: 'Leonard Ravenhill', icon: 'app/assets/speakers/leonardravenhill.webp'},
    {name: 'Major Ian Thomas', icon: 'app/assets/speakers/majorianthomas.webp'},
    {name: 'Manley Beasley', icon: 'app/assets/speakers/mansleybeasley.webp'},
    {name: 'Milton Green', icon: 'app/assets/speakers/miltongreen.webp'},
    {name: 'Oswald J. Smith', icon: 'app/assets/speakers/joswaldsmith.webp'},
    {name: 'Paris Reidhead', icon: 'app/assets/speakers/parisreidhead.webp'},
    {name: 'Paul Washer', icon: 'app/assets/speakers/paulwasher.webp'},
    {name: 'Rolfe Barnard', icon: 'app/assets/speakers/rolfebarnard.webp'},
    {name: 'Roy Hession', icon: 'app/assets/speakers/royhession.webp'},
    {name: 'Shane Idleman', icon: 'app/assets/speakers/shaneidleman.webp'},
    {name: 'Stephen Kaung', icon: 'app/assets/speakers/stephenkaung.webp'},
    {name: 'T. Austin Sparks', icon: 'app/assets/speakers/taustinsparks.webp'},
    {name: 'Vance Havner', icon: 'app/assets/speakers/vancehavner.webp'},
    {name: 'Warren Wiersbe', icon: 'app/assets/speakers/warrenwiersbe.webp'},
    {name: 'William MacDonald', icon: 'app/assets/speakers/williammacdonald.webp'},
    {name: 'Zac Poonen', icon: 'app/assets/speakers/zacpoonen.webp'}
  ];

  return (
    <div className="p-2 bg-white border-b-2 border-[#707032] rounded-lg">
      <div className="flex flex-wrap justify-center">
        {speakers.map((speaker, index) => (
          <div key={index} className="flex flex-col items-center m-2">
            <img src={speaker.icon} alt={speaker.name} className="w-16 h-16 rounded-full"/>
            <p className="text-center mt-2 text-sm">{speaker.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};