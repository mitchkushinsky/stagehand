export const STAGE_NAMES = {
  'Abita Beer': 'Abita Beer Stage',
  'NewOrleans.com': 'NewOrleans.com Stage',
  'Hand Grenade': 'Tropical Isle Hand Grenade Stage',
  "Jack Daniel's": "Jack Daniel's Stage",
  'Willow Dispensary': 'Willow Dispensary Stage',
  'Loyola Esplanade': 'Loyola Esplanade in the Shade Stage',
  'Fish Fry': 'Louisiana Fish Fry Stage',
  'Songwriter': 'Entergy Songwriter Stage',
  'Pan-American Life': 'Pan-American Life Insurance Group Stage',
  'Jazz Playhouse': 'Jazz Playhouse at the Royal Sonesta',
  'French Market Jazz': 'French Market Traditional Jazz Stage',
  'Dutch Alley': 'French Market Dutch Alley Stage',
  'Voodoo Garden': 'House of Blues Voodoo Garden Stage',
  "Jazz Nat'l Park": 'New Orleans Jazz National Historical Park Stage',
  'Schoolhouse': "Ernie's Schoolhouse Stage",
  'Hancock Whitney': 'Hancock Whitney Stage',
  'Omni Royal Orleans': 'Omni Royal Orleans Stage',
  'KREWE Eyewear': 'KREWE Eyewear Stage',
  'Cafe Beignet': 'Cafe Beignet Stage',
}

export const DAYS = {
  thursday: { label: 'Thu', date: 'April 9' },
  friday:   { label: 'Fri', date: 'April 10' },
  saturday: { label: 'Sat', date: 'April 11' },
  sunday:   { label: 'Sun', date: 'April 12' },
}

export const schedule = {
  thursday: [
    { stage: 'Abita Beer', sets: [
      { artist: 'Seguenon Kone featuring Ivorie Spectacle', start: '11:30 AM', end: '12:30 PM' },
      { artist: 'The Quickening', start: '12:50 PM', end: '1:50 PM' },
      { artist: 'Kermit Ruffins & the Barbecue Swingers', start: '2:10 PM', end: '3:10 PM' },
      { artist: 'Tribal Gold', start: '3:30 PM', end: '4:30 PM' },
      { artist: 'Erica Falls & Vintage Soul', start: '4:50 PM', end: '6:10 PM' },
      { artist: 'Rebirth Brass Band', start: '5:00 PM', end: '6:20 PM' },
      { artist: 'The Soul Rebels', start: '6:40 PM', end: '8:00 PM' },
    ]},
    { stage: 'NewOrleans.com', sets: [
      { artist: 'Preservation Brass', start: '11:15 AM', end: '12:25 PM' },
      { artist: 'Banu Gibson', start: '12:45 PM', end: '2:00 PM' },
      { artist: 'Mahogany Hall All Stars Band', start: '2:20 PM', end: '3:30 PM' },
      { artist: "Leroy Jones & New Orleans' Finest", start: '3:50 PM', end: '5:10 PM' },
      { artist: 'The Lilli Lewis Project', start: '5:30 PM', end: '6:45 PM' },
      { artist: 'Bobby Rush', start: '6:50 PM', end: '8:00 PM' },
    ]},
    { stage: 'Hand Grenade', sets: [
      { artist: 'Mem Shannon & The Membership', start: '11:10 AM', end: '12:10 PM' },
      { artist: 'Sir Chantz Powell & The Sound Of Funk', start: '12:30 PM', end: '1:30 PM' },
      { artist: 'Susan Cowsill', start: '1:50 PM', end: '2:50 PM' },
      { artist: 'Yusa & Mahmoud Chouki', start: '3:10 PM', end: '4:10 PM' },
      { artist: 'Royal Essence', start: '4:30 PM', end: '5:45 PM' },
      { artist: 'Bag of Donuts', start: '6:15 PM', end: '7:45 PM' },
      { artist: 'Johnny Sketch and the Dirty Notes', start: '6:45 PM', end: '8:00 PM' },
    ]},
    { stage: "Jack Daniel's", sets: [
      { artist: "R & R Smokin' Foundation", start: '11:10 AM', end: '12:30 PM' },
      { artist: 'Bon Bon Vivant', start: '12:50 PM', end: '1:50 PM' },
      { artist: 'Juice', start: '2:10 PM', end: '3:10 PM' },
      { artist: 'Sierra Green and the Giants', start: '3:30 PM', end: '4:40 PM' },
      { artist: 'Rebirth Brass Band', start: '5:00 PM', end: '6:20 PM' },
      { artist: 'Bobby Rush', start: '6:50 PM', end: '8:00 PM' },
    ]},
    { stage: 'Willow Dispensary', sets: [
      { artist: "T'Monde", start: '11:10 AM', end: '12:20 PM' },
      { artist: 'Gerard Delafose and The Zydeco Gators', start: '12:40 PM', end: '1:50 PM' },
      { artist: 'Waylon Thibodeaux Band', start: '2:10 PM', end: '3:10 PM' },
      { artist: 'Nathan and the Zydeco Cha Chas', start: '3:30 PM', end: '4:40 PM' },
      { artist: 'Amanda Shaw', start: '5:00 PM', end: '6:10 PM' },
      { artist: 'Johnny Sketch and the Dirty Notes', start: '6:45 PM', end: '8:00 PM' },
    ]},
    { stage: 'Fish Fry', sets: [
      { artist: 'Red Hot Brass Band', start: '11:10 AM', end: '12:30 PM' },
      { artist: '504 Millz', start: '12:35 PM', end: '1:05 PM' },
      { artist: 'J.A.M. Brass Band', start: '1:10 PM', end: '2:30 PM' },
      { artist: 'Zeus', start: '2:35 PM', end: '3:15 PM' },
      { artist: 'SOUL Brass Band', start: '3:20 PM', end: '4:40 PM' },
      { artist: 'DJ Legatron Prime', start: '4:45 PM', end: '5:30 PM' },
      { artist: 'New Orleans Nightcrawlers', start: '5:35 PM', end: '6:55 PM' },
      { artist: 'Raj Smoove', start: '7:00 PM', end: '8:00 PM' },
    ]},
    { stage: 'Pan-American Life', sets: [
      { artist: 'Gal Holiday and the Honky Tonk Revue', start: '11:00 AM', end: '12:10 PM' },
      { artist: 'The Tin Men', start: '12:30 PM', end: '1:30 PM' },
      { artist: 'T-Ray & The Trendsetters', start: '1:50 PM', end: '2:50 PM' },
      { artist: 'Muévelo', start: '3:10 PM', end: '4:10 PM' },
      { artist: 'John Mooney', start: '4:30 PM', end: '5:50 PM' },
      { artist: 'The New Orleans Klezmer All Stars', start: '6:10 PM', end: '7:30 PM' },
    ]},
    { stage: 'Voodoo Garden', sets: [
      { artist: 'Jake Landry', start: '12:30 PM', end: '2:30 PM' },
      { artist: 'Funky Lampshades', start: '3:00 PM', end: '5:00 PM' },
      { artist: 'Cary Hudson', start: '5:30 PM', end: '7:30 PM' },
      { artist: 'Julian Primeaux', start: '7:30 PM', end: '9:30 PM' },
    ]},
    { stage: 'Songwriter', sets: [
      { artist: 'Funky Lampshades', start: '3:00 PM', end: '5:00 PM' },
      { artist: 'Cary Hudson', start: '5:30 PM', end: '7:30 PM' },
      { artist: 'Julian Primeaux', start: '7:30 PM', end: '9:30 PM' },
    ]},
  ],

  friday: [
    { stage: 'Abita Beer', sets: [
      { artist: 'Bo Dollis Jr. and the Wild Magnolias', start: '11:30 AM', end: '12:30 PM' },
      { artist: 'Irvin Mayfield', start: '12:50 PM', end: '1:50 PM' },
      { artist: 'The Dixie Cups', start: '2:10 PM', end: '3:10 PM' },
      { artist: 'Bonerama', start: '3:30 PM', end: '4:30 PM' },
      { artist: 'Jon Cleary & the Absolute Monster Gentlemen', start: '4:50 PM', end: '6:10 PM' },
      { artist: 'PJ Morton', start: '6:40 PM', end: '8:00 PM' },
    ]},
    { stage: 'NewOrleans.com', sets: [
      { artist: 'John Boutté', start: '11:15 AM', end: '12:25 PM' },
      { artist: 'Don Vappie and the Creole Jazz Serenaders', start: '12:45 PM', end: '2:00 PM' },
      { artist: 'Lawrence Cotton Legendary Experience', start: '2:20 PM', end: '3:30 PM' },
      { artist: "Kyle Roussel's Church of New Orleans", start: '3:50 PM', end: '5:00 PM' },
      { artist: 'Robin Barnes & The Fiya Birds', start: '5:20 PM', end: '6:45 PM' },
      { artist: 'The Dirty Dozen Brass Band', start: '6:50 PM', end: '8:00 PM' },
    ]},
    { stage: 'Hand Grenade', sets: [
      { artist: 'Maji Melodies - Semaj & The Blues Experiment', start: '11:10 AM', end: '12:10 PM' },
      { artist: "Joe Lastie's Jazz to Brass feat. Dr. Pathorn", start: '12:30 PM', end: '1:30 PM' },
      { artist: 'Ashton Hines and the Big Easy Brawlers', start: '1:50 PM', end: '2:50 PM' },
      { artist: "Sally Baby's Silver Dollars", start: '3:10 PM', end: '4:10 PM' },
      { artist: 'Deezle', start: '4:30 PM', end: '5:45 PM' },
      { artist: 'Lisa Amos', start: '6:15 PM', end: '7:45 PM' },
      { artist: 'Brass-A-Holics', start: '6:40 PM', end: '8:00 PM' },
    ]},
    { stage: "Jack Daniel's", sets: [
      { artist: 'Khris Royal and Dark Matter', start: '11:10 AM', end: '12:30 PM' },
      { artist: 'Cole Williams', start: '12:50 PM', end: '1:50 PM' },
      { artist: 'The Iguanas', start: '2:10 PM', end: '3:10 PM' },
      { artist: 'People Museum', start: '3:30 PM', end: '4:40 PM' },
      { artist: 'LSD Clown System', start: '5:00 PM', end: '6:20 PM' },
      { artist: 'The Dirty Dozen Brass Band', start: '6:50 PM', end: '8:00 PM' },
    ]},
    { stage: 'Willow Dispensary', sets: [
      { artist: 'T Marie and Bayou Juju', start: '11:10 AM', end: '12:20 PM' },
      { artist: "T'Canaille", start: '12:40 PM', end: '1:50 PM' },
      { artist: 'B. Cam & The Zydeco Young Bucks', start: '2:10 PM', end: '3:10 PM' },
      { artist: 'Lost Bayou Ramblers', start: '3:30 PM', end: '4:40 PM' },
      { artist: 'Sunpie and the Louisiana Sunspots', start: '5:00 PM', end: '6:10 PM' },
      { artist: 'Brass-A-Holics', start: '6:40 PM', end: '8:00 PM' },
    ]},
    { stage: 'Loyola Esplanade', sets: [
      { artist: 'Kirkland Green', start: '11:00 AM', end: '12:00 PM' },
      { artist: 'Tuller, Not Related, Liam Escame, and Surco', start: '12:20 PM', end: '1:35 PM' },
      { artist: 'The RiverBenders', start: '1:55 PM', end: '2:50 PM' },
      { artist: 'Pellow Talk & Alfred Banks', start: '3:10 PM', end: '4:10 PM' },
      { artist: 'New Orleans Legacy Coalition', start: '4:30 PM', end: '5:30 PM' },
      { artist: 'Cha Wa', start: '5:50 PM', end: '7:00 PM' },
    ]},
    { stage: 'Fish Fry', sets: [
      { artist: 'Magnetic Ear', start: '11:10 AM', end: '12:20 PM' },
      { artist: 'Tidal Wave Brass Band', start: '12:40 PM', end: '2:00 PM' },
      { artist: 'DJ ChiNola', start: '2:05 PM', end: '2:35 PM' },
      { artist: 'Young Pinstripe Brass Band', start: '2:40 PM', end: '4:00 PM' },
      { artist: 'Kidd Love', start: '4:05 PM', end: '4:35 PM' },
      { artist: 'Treme Brass Band', start: '4:40 PM', end: '5:45 PM' },
      { artist: 'DJ Polo504', start: '5:50 PM', end: '6:35 PM' },
      { artist: "Sporty's Brass Band", start: '6:40 PM', end: '8:00 PM' },
    ]},
    { stage: 'Songwriter', sets: [
      { artist: 'Don Paul and Rivers Answer Moons', start: '11:00 AM', end: '11:55 AM' },
      { artist: 'Lisbon Girls', start: '12:15 PM', end: '1:10 PM' },
      { artist: 'Kelly Love Jones', start: '1:30 PM', end: '2:25 PM' },
      { artist: 'Johnny Sansone', start: '2:45 PM', end: '3:40 PM' },
      { artist: 'Max Bien-Kahn', start: '4:00 PM', end: '5:00 PM' },
    ]},
    { stage: 'Pan-American Life', sets: [
      { artist: 'Lulu and the Broadsides', start: '11:00 AM', end: '12:10 PM' },
      { artist: 'Arsène Delay & Charlie Wooton', start: '12:30 PM', end: '1:30 PM' },
      { artist: 'Dusky Waters', start: '1:50 PM', end: '2:50 PM' },
      { artist: 'Amigos do Samba', start: '3:10 PM', end: '4:10 PM' },
      { artist: 'Camile Baudoin and Friends', start: '4:30 PM', end: '5:20 PM' },
      { artist: 'Bill Summers & Jazalsa', start: '6:10 PM', end: '7:30 PM' },
    ]},
    { stage: 'Jazz Playhouse', sets: [
      { artist: 'The Sam Lobley Band', start: '11:00 AM', end: '1:30 PM' },
      { artist: 'Antoine Diel & New Orleans Misfit Power Band', start: '2:00 PM', end: '4:30 PM' },
      { artist: 'Chucky C & Friends', start: '5:00 PM', end: '7:30 PM' },
    ]},
    { stage: 'French Market Jazz', sets: [
      { artist: 'Panorama Jazz Band', start: '11:30 AM', end: '1:00 PM' },
      { artist: 'Rickie Monie & the Traditional Jazz Ramblers', start: '1:30 PM', end: '3:00 PM' },
      { artist: 'The New Orleans Flairs', start: '3:30 PM', end: '5:00 PM' },
      { artist: 'Ingrid Lucia', start: '5:30 PM', end: '7:00 PM' },
    ]},
    { stage: 'Dutch Alley', sets: [
      { artist: 'Tyler Twerk Thomson', start: '11:15 AM', end: '12:30 PM' },
      { artist: 'Palmetto Bug Stompers', start: '12:45 PM', end: '2:00 PM' },
      { artist: 'The Pfister Sisters', start: '2:15 PM', end: '3:30 PM' },
      { artist: 'New Orleans Classic Jazz Orchestra', start: '3:45 PM', end: '5:00 PM' },
    ]},
    { stage: 'Voodoo Garden', sets: [
      { artist: 'Shawan Rice Trio', start: '11:15 AM', end: '12:30 PM' },
      { artist: 'Joey Houcke', start: '12:45 PM', end: '2:45 PM' },
      { artist: 'Electric Ramble', start: '3:00 PM', end: '5:00 PM' },
      { artist: 'Borders Trio', start: '5:15 PM', end: '7:15 PM' },
      { artist: 'Tanglers', start: '7:30 PM', end: '9:30 PM' },
    ]},
  ],

  saturday: [
    { stage: 'Abita Beer', sets: [
      { artist: 'Gregg Martinez & the Delta Kings', start: '11:30 AM', end: '12:30 PM' },
      { artist: 'Ryan Batiste and Raw Revolution', start: '12:50 PM', end: '1:50 PM' },
      { artist: 'Big Chief Monk Boudreaux and the Golden Eagles', start: '2:10 PM', end: '3:10 PM' },
      { artist: 'Dawn Richard', start: '3:30 PM', end: '4:30 PM' },
      { artist: "George Porter Jr & Runnin' Pardners", start: '5:00 PM', end: '6:20 PM' },
      { artist: 'Flow Tribe', start: '6:40 PM', end: '8:00 PM' },
    ]},
    { stage: 'NewOrleans.com', sets: [
      { artist: 'Tim Laughlin', start: '11:15 AM', end: '12:35 PM' },
      { artist: 'The Big Easy Boys', start: '12:45 PM', end: '2:00 PM' },
      { artist: 'Wendell Brunious', start: '2:20 PM', end: '3:30 PM' },
      { artist: 'Charmaine Neville', start: '3:50 PM', end: '5:00 PM' },
      { artist: 'James Andrews', start: '5:20 PM', end: '6:45 PM' },
      { artist: 'Big Freedia', start: '6:50 PM', end: '8:00 PM' },
    ]},
    { stage: 'Hand Grenade', sets: [
      { artist: 'Christian Serpas & Ghost Town', start: '11:10 AM', end: '12:10 PM' },
      { artist: 'Ovi-G presents "Xtra Cash!"', start: '12:30 PM', end: '1:30 PM' },
      { artist: 'Ronnie Lamarque Orchestra featuring Hot Rod Lincoln', start: '2:00 PM', end: '3:15 PM' },
      { artist: 'Victor Campbell & Timba Swamp', start: '3:35 PM', end: '4:35 PM' },
      { artist: 'Flagboy Giz & the Wild Tchoupitoulas', start: '4:55 PM', end: '5:55 PM' },
      { artist: 'Higher Heights Reggae Band', start: '6:15 PM', end: '7:45 PM' },
      { artist: 'Sweet Crude', start: '6:30 PM', end: '8:00 PM' },
    ]},
    { stage: "Jack Daniel's", sets: [
      { artist: 'Lily Unless and The If Onlys', start: '11:10 AM', end: '12:30 PM' },
      { artist: 'Paul Sanchez', start: '12:50 PM', end: '1:50 PM' },
      { artist: 'Water Seed', start: '2:10 PM', end: '3:10 PM' },
      { artist: 'Iceman Special', start: '3:30 PM', end: '4:40 PM' },
      { artist: 'The Original Pinettes Brass Band', start: '5:00 PM', end: '6:20 PM' },
      { artist: 'Big Freedia', start: '6:50 PM', end: '8:00 PM' },
    ]},
    { stage: 'Willow Dispensary', sets: [
      { artist: 'Bruce Daigrepont Cajun Band', start: '11:10 AM', end: '12:20 PM' },
      { artist: 'Magnolia Sisters', start: '12:40 PM', end: '1:50 PM' },
      { artist: 'Donna Angelle & the Zydeco Posse', start: '2:10 PM', end: '3:10 PM' },
      { artist: 'Corey Ledet Zydeco & Black Magic', start: '3:30 PM', end: '4:40 PM' },
      { artist: 'Dwayne Dopsie and the Zydeco Hellraisers', start: '5:00 PM', end: '6:10 PM' },
      { artist: 'Sweet Crude', start: '6:30 PM', end: '8:00 PM' },
    ]},
    { stage: 'Loyola Esplanade', sets: [
      { artist: 'Loyola University Commercial Ensemble', start: '11:00 AM', end: '12:15 PM' },
      { artist: 'Joy Clark', start: '12:35 PM', end: '1:45 PM' },
      { artist: 'Tay/Heavensworld/Ja Fierce & Azure Skye', start: '2:10 PM', end: '3:30 PM' },
      { artist: 'Mia Borders', start: '3:50 PM', end: '5:10 PM' },
      { artist: 'John "Papa" Gros', start: '5:30 PM', end: '7:00 PM' },
    ]},
    { stage: 'Fish Fry', sets: [
      { artist: 'Red Wolf Brass Band', start: '11:10 AM', end: '12:30 PM' },
      { artist: 'DJ Hollaback', start: '12:35 PM', end: '1:05 PM' },
      { artist: 'Storyville Stompers Brass Band', start: '1:10 PM', end: '2:30 PM' },
      { artist: 'DJ Spin', start: '2:35 PM', end: '3:15 PM' },
      { artist: 'Original Hurricane Brass Band', start: '3:20 PM', end: '4:40 PM' },
      { artist: 'DJ RQ Away', start: '4:45 PM', end: '5:30 PM' },
      { artist: 'Big 6 Brass Band', start: '5:35 PM', end: '6:55 PM' },
      { artist: 'DJ Poppa', start: '7:00 PM', end: '8:00 PM' },
    ]},
    { stage: 'Songwriter', sets: [
      { artist: 'John Rankin', start: '11:00 AM', end: '11:55 AM' },
      { artist: 'Beth Patterson', start: '12:15 PM', end: '1:10 PM' },
      { artist: 'Kyle Alexander', start: '1:30 PM', end: '2:25 PM' },
      { artist: 'Daphne Parker Powell', start: '2:45 PM', end: '3:45 PM' },
      { artist: 'AdoSoul and the Tribe', start: '4:05 PM', end: '5:00 PM' },
    ]},
    { stage: 'Pan-American Life', sets: [
      { artist: 'Legendary Barbara Shorts and Blue Jazz', start: '11:00 AM', end: '12:10 PM' },
      { artist: 'Lynn Drury', start: '12:30 PM', end: '1:30 PM' },
      { artist: 'Vivaz', start: '1:50 PM', end: '2:50 PM' },
      { artist: 'Ever More Nest', start: '3:10 PM', end: '4:10 PM' },
      { artist: 'Troy Sawyer and the Elementz', start: '4:30 PM', end: '5:50 PM' },
      { artist: 'Fermín Ceballos + Merengue4FOUR', start: '6:10 PM', end: '7:30 PM' },
    ]},
    { stage: 'Jazz Playhouse', sets: [
      { artist: 'Audrey Lecrone', start: '11:00 AM', end: '1:30 PM' },
      { artist: 'The Wolfe Johns Blues Band', start: '2:00 PM', end: '4:30 PM' },
      { artist: "Richard 'Piano' Scott & The Twisty River Band", start: '5:00 PM', end: '7:30 PM' },
    ]},
    { stage: 'French Market Jazz', sets: [
      { artist: 'Secret Six Jazz Band', start: '11:30 AM', end: '1:00 PM' },
      { artist: 'New Orleans Cottonmouth Kings', start: '1:30 PM', end: '3:00 PM' },
      { artist: 'Alicia Renee aka Blue Eyes Sextet', start: '3:30 PM', end: '5:00 PM' },
      { artist: 'The Jump Hounds', start: '5:30 PM', end: '7:00 PM' },
    ]},
    { stage: 'Dutch Alley', sets: [
      { artist: 'Kid Simmons Jazz Band', start: '11:15 AM', end: '12:30 PM' },
      { artist: "Stephen Walker N'Em Swinging in New Orleans", start: '12:45 PM', end: '2:00 PM' },
      { artist: 'Kevin Ray Clark and Bourbon Street All Stars', start: '2:15 PM', end: '3:30 PM' },
      { artist: 'New Orleans Ragtime Orchestra ft. Lars Edegran', start: '3:45 PM', end: '5:00 PM' },
    ]},
    { stage: 'Voodoo Garden', sets: [
      { artist: 'Tiago Guy & Renee Gros', start: '11:15 AM', end: '12:30 PM' },
      { artist: 'Pocket Chocolate', start: '12:45 PM', end: '2:45 PM' },
      { artist: 'Jamey St. Pierre', start: '3:00 PM', end: '5:00 PM' },
      { artist: 'Eric Johanson', start: '5:15 PM', end: '7:15 PM' },
      { artist: 'Sansone & John Fohl', start: '7:30 PM', end: '9:30 PM' },
    ]},
    { stage: "Jazz Nat'l Park", sets: [
      { artist: 'Congo Square Preservation Society', start: '11:00 AM', end: '12:00 PM' },
      { artist: 'Jamil Sharif Quartet', start: '12:15 PM', end: '1:15 PM' },
      { artist: 'Shake Em Up Jazz Band', start: '1:30 PM', end: '2:30 PM' },
      { artist: 'Young Tuxedo Brass Band', start: '2:45 PM', end: '3:45 PM' },
      { artist: 'Saskia Walker Big Band', start: '4:00 PM', end: '5:00 PM' },
    ]},
    { stage: 'Schoolhouse', sets: [
      { artist: 'Lycée Français Musicians', start: '11:00 AM', end: '12:00 PM' },
      { artist: 'Pierre A Capdau Marching Jaguars', start: '12:20 PM', end: '1:20 PM' },
      { artist: 'McMain Singing Mustangs', start: '1:50 PM', end: '2:50 PM' },
      { artist: 'The Roots of Music', start: '3:10 PM', end: '4:10 PM' },
      { artist: 'Audubon Charter School R&B Choir', start: '4:30 PM', end: '5:30 PM' },
    ]},
    { stage: 'Hancock Whitney', sets: [
      { artist: "Clive Wilson's New Orleans Serenaders", start: '11:30 AM', end: '12:45 PM' },
      { artist: 'Caleb Tokarska', start: '1:00 PM', end: '2:15 PM' },
      { artist: 'John Mahoney Little Band', start: '2:30 PM', end: '3:45 PM' },
      { artist: 'Steve Pistorius & the Southern Syncopators', start: '4:00 PM', end: '5:15 PM' },
    ]},
    { stage: 'Omni Royal Orleans', sets: [
      { artist: 'Garden District Jazz Band', start: '11:15 AM', end: '12:30 PM' },
      { artist: 'Marlon Jordan and Quartet', start: '12:45 PM', end: '2:00 PM' },
      { artist: 'Louis Michot and Swamp Magic', start: '2:15 PM', end: '3:30 PM' },
      { artist: 'The Crybabies', start: '3:45 PM', end: '5:00 PM' },
    ]},
    { stage: 'KREWE Eyewear', sets: [
      { artist: 'Bad Penny Pleasuremakers', start: '11:00 AM', end: '12:15 PM' },
      { artist: 'Washboard Chaz Blues Trio', start: '12:30 PM', end: '1:45 PM' },
      { artist: 'Nanci Zhang', start: '2:00 PM', end: '3:15 PM' },
      { artist: 'Aurora Nealand & the Royal Roses', start: '3:30 PM', end: '4:45 PM' },
    ]},
    { stage: 'Cafe Beignet', sets: [
      { artist: 'The Beignet Orchestra', start: '11:30 AM', end: '2:00 PM' },
      { artist: 'Zach Wiggins Trio', start: '2:30 PM', end: '5:00 PM' },
    ]},
  ],

  sunday: [
    { stage: 'Abita Beer', sets: [
      { artist: 'Sam Price & the True Believers', start: '11:30 AM', end: '12:30 PM' },
      { artist: 'Bucktown All-Stars', start: '12:50 PM', end: '1:50 PM' },
      { artist: 'New Orleans Suspects', start: '2:10 PM', end: '3:10 PM' },
      { artist: 'Jelly Joseph', start: '3:30 PM', end: '4:30 PM' },
      { artist: 'Hasizzle with TBC Brass Band', start: '5:00 PM', end: '6:20 PM' },
      { artist: 'Cyril Neville', start: '6:50 PM', end: '8:00 PM' },
    ]},
    { stage: 'NewOrleans.com', sets: [
      { artist: 'Tuba Skinny', start: '11:15 AM', end: '12:25 PM' },
      { artist: 'Lena Prima', start: '12:45 PM', end: '2:00 PM' },
      { artist: 'Jeremy Davenport', start: '2:20 PM', end: '3:30 PM' },
      { artist: 'Judith Owen & Her Gentlemen Callers', start: '3:50 PM', end: '5:10 PM' },
      { artist: 'Delfeayo Marsalis & the Uptown Jazz Orchestra', start: '5:30 PM', end: '6:45 PM' },
      { artist: 'Cupid & the Dance Party Express Band', start: '6:40 PM', end: '8:00 PM' },
    ]},
    { stage: 'Hand Grenade', sets: [
      { artist: 'Professor Craig Adams & the Higher Dimensions Band', start: '11:10 AM', end: '12:10 PM' },
      { artist: 'Alex McMurray', start: '12:30 PM', end: '1:30 PM' },
      { artist: 'Assata Renay', start: '1:50 PM', end: '2:50 PM' },
      { artist: 'Wanda Rouzan and a Taste of New Orleans', start: '3:10 PM', end: '4:10 PM' },
      { artist: 'Big Frank & Lil Frank & the Dirty Old Men', start: '4:30 PM', end: '5:45 PM' },
      { artist: 'Honey Island Swamp Band', start: '6:15 PM', end: '7:45 PM' },
    ]},
    { stage: "Jack Daniel's", sets: [
      { artist: 'Roderick "Rev" Paulin and The Congregation', start: '11:10 AM', end: '12:30 PM' },
      { artist: 'Jason Neville Funky Soul Allstar Band', start: '12:50 PM', end: '1:50 PM' },
      { artist: 'Gumbeaux Juice', start: '2:10 PM', end: '3:10 PM' },
      { artist: 'The Rumble featuring Chief Joseph Boudreaux Jr', start: '3:30 PM', end: '4:30 PM' },
      { artist: 'Irma Thomas, Soul Queen of New Orleans', start: '5:00 PM', end: '6:10 PM' },
      { artist: 'Cupid & the Dance Party Express Band', start: '6:40 PM', end: '8:00 PM' },
    ]},
    { stage: 'Willow Dispensary', sets: [
      { artist: 'Les Femmes Farouches', start: '11:10 AM', end: '12:20 PM' },
      { artist: 'Cameron Dupuy & the Cajun Troubadours', start: '12:40 PM', end: '1:50 PM' },
      { artist: 'Yvette Landry & the Jukes', start: '2:10 PM', end: '3:10 PM' },
      { artist: 'Buckwheat Zydeco Jr. and The Legendary Ils Sont Partis Band', start: '3:30 PM', end: '4:40 PM' },
      { artist: 'Chubby Carrier and the Bayou Swamp Band', start: '5:00 PM', end: '6:10 PM' },
      { artist: "Rockin' Dopsie Jr. & the Zydeco Twisters", start: '6:40 PM', end: '8:00 PM' },
    ]},
    { stage: 'Loyola Esplanade', sets: [
      { artist: 'Casme', start: '11:00 AM', end: '12:00 PM' },
      { artist: 'Across Phoenix, James Wyzten, Kissing Disease', start: '12:20 PM', end: '1:35 PM' },
      { artist: 'Kristin Diable', start: '1:55 PM', end: '2:50 PM' },
      { artist: 'Helen Gillet: ReBelle Musique', start: '3:10 PM', end: '4:10 PM' },
      { artist: 'Creole String Beans', start: '4:30 PM', end: '5:30 PM' },
      { artist: 'Astral Project', start: '5:50 PM', end: '7:00 PM' },
    ]},
    { stage: 'Fish Fry', sets: [
      { artist: "Smokin' on Some Brass", start: '11:10 AM', end: '12:20 PM' },
      { artist: 'New Birth Brass Band', start: '12:40 PM', end: '2:00 PM' },
      { artist: 'DJ Vintage', start: '2:05 PM', end: '2:35 PM' },
      { artist: 'Kings of Brass', start: '2:40 PM', end: '4:00 PM' },
      { artist: 'DJ ODD Spinz', start: '4:05 PM', end: '4:35 PM' },
      { artist: 'Hot 8 Brass Band', start: '4:40 PM', end: '5:45 PM' },
      { artist: 'ANTWIGADEE!', start: '5:50 PM', end: '6:35 PM' },
      { artist: 'New Breed', start: '6:40 PM', end: '8:00 PM' },
    ]},
    { stage: 'Songwriter', sets: [
      { artist: 'Andy J Forest Treeaux', start: '11:00 AM', end: '11:55 AM' },
      { artist: 'Luke Allen', start: '12:15 PM', end: '1:10 PM' },
      { artist: 'Justin Garner', start: '1:30 PM', end: '2:25 PM' },
      { artist: 'Bobbi Rae', start: '2:45 PM', end: '3:45 PM' },
      { artist: 'Cristina Kaminis', start: '4:05 PM', end: '5:00 PM' },
    ]},
    { stage: 'Pan-American Life', sets: [
      { artist: 'Bamboula 2000', start: '11:10 AM', end: '12:10 PM' },
      { artist: 'Anaïs St. John', start: '12:30 PM', end: '1:30 PM' },
      { artist: 'Papo y Son Mandao', start: '1:50 PM', end: '2:50 PM' },
      { artist: 'Los Güiros', start: '3:10 PM', end: '4:10 PM' },
      { artist: 'Stanton Moore featuring Joe Ashlar and Danny Abel', start: '4:30 PM', end: '5:50 PM' },
      { artist: 'Leyla McCalla', start: '6:10 PM', end: '7:30 PM' },
    ]},
    { stage: 'Jazz Playhouse', sets: [
      { artist: 'Jenna McSwain Jazz Band', start: '11:00 AM', end: '1:30 PM' },
      { artist: 'Jeanne Marie Harris', start: '2:00 PM', end: '4:30 PM' },
      { artist: 'Gerald French & The Original Tuxedo Jazz Band', start: '5:00 PM', end: '7:30 PM' },
    ]},
    { stage: 'French Market Jazz', sets: [
      { artist: 'Smoking Time Jazz Club', start: '11:30 AM', end: '1:00 PM' },
      { artist: 'Charlie Halloran and the Tropicales', start: '1:30 PM', end: '3:00 PM' },
      { artist: 'The New Orleans Swinging Gypsies', start: '3:30 PM', end: '5:00 PM' },
      { artist: "Sullivan Dabney's Muzik Jazz Band", start: '5:30 PM', end: '7:00 PM' },
    ]},
    { stage: 'Dutch Alley', sets: [
      { artist: 'Hot Club of New Orleans', start: '11:15 AM', end: '12:30 PM' },
      { artist: 'Mayumi Shara & New Orleans Jazz Letters', start: '12:45 PM', end: '2:00 PM' },
      { artist: 'Jade Perdue', start: '2:15 PM', end: '3:30 PM' },
      { artist: 'Tom Saunders and the Hotcats', start: '3:45 PM', end: '5:00 PM' },
    ]},
    { stage: 'Voodoo Garden', sets: [
      { artist: 'Sophia Parigi', start: '12:30 PM', end: '2:30 PM' },
      { artist: 'Sean Riley', start: '3:00 PM', end: '5:00 PM' },
    ]},
    { stage: "Jazz Nat'l Park", sets: [
      { artist: "Craig Klein's New Orleans Allstars", start: '11:00 AM', end: '12:00 PM' },
      { artist: 'Matt Lemmler presents "New Orleans in Stride"', start: '12:15 PM', end: '1:15 PM' },
      { artist: 'Crescent City Sisters', start: '1:30 PM', end: '2:30 PM' },
      { artist: 'Louis Ford', start: '2:45 PM', end: '3:45 PM' },
      { artist: 'Arrowhead Jazz Band', start: '4:00 PM', end: '5:00 PM' },
    ]},
    { stage: 'Schoolhouse', sets: [
      { artist: 'Greater New Orleans Youth Orchestras', start: '11:00 AM', end: '12:00 PM' },
      { artist: 'Chalmette High School Marching Band', start: '12:20 PM', end: '1:20 PM' },
      { artist: "St. Mary's Academy Gospel Choir", start: '1:50 PM', end: '2:50 PM' },
      { artist: 'Don Jamison Heritage School of Music', start: '3:10 PM', end: '4:10 PM' },
      { artist: 'Walter L. Cohen High School Marching Band', start: '4:30 PM', end: '5:30 PM' },
    ]},
    { stage: 'Hancock Whitney', sets: [
      { artist: 'Kid Merv & All That Jazz', start: '11:30 AM', end: '12:45 PM' },
      { artist: 'Miss Sophie Lee', start: '1:00 PM', end: '2:15 PM' },
      { artist: 'Mark Brooks', start: '2:30 PM', end: '3:45 PM' },
      { artist: 'New Orleans High Society', start: '4:00 PM', end: '5:15 PM' },
    ]},
    { stage: 'Omni Royal Orleans', sets: [
      { artist: 'Jason Mingledorff', start: '11:15 AM', end: '12:30 PM' },
      { artist: 'Father Ron and Friends', start: '12:45 PM', end: '2:00 PM' },
      { artist: 'Sweetie Pies of New Orleans', start: '2:15 PM', end: '3:30 PM' },
      { artist: "Ecirb Müller's Twisted Dixie", start: '3:45 PM', end: '5:00 PM' },
    ]},
    { stage: 'KREWE Eyewear', sets: [
      { artist: 'Capivaras Jazz Quartet', start: '11:00 AM', end: '12:15 PM' },
      { artist: 'The New Orleans Jazz Vipers', start: '12:30 PM', end: '1:45 PM' },
      { artist: "Seva Venet's Traditional Line-Up", start: '2:00 PM', end: '3:15 PM' },
      { artist: 'Harry Mayronne & Chloe Marie', start: '3:30 PM', end: '4:45 PM' },
    ]},
    { stage: 'Cafe Beignet', sets: [
      { artist: 'Steamboat Willy', start: '11:30 AM', end: '2:00 PM' },
      { artist: 'Steve Rohbock Trio', start: '2:30 PM', end: '5:00 PM' },
    ]},
  ],
}

const DATE_MAP = {
  thursday: '2026-04-09',
  friday: '2026-04-10',
  saturday: '2026-04-11',
  sunday: '2026-04-12',
}

export function parseSetTime(timeStr, day) {
  const [time, meridiem] = timeStr.split(' ')
  let [hours, minutes] = time.split(':').map(Number)
  if (meridiem === 'PM' && hours !== 12) hours += 12
  if (meridiem === 'AM' && hours === 12) hours = 0
  return new Date(`${DATE_MAP[day]}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`)
}

export function isSetActive(set, day) {
  const now = new Date()
  const start = parseSetTime(set.start, day)
  const end = parseSetTime(set.end, day)
  return now >= start && now <= end
}

export function isSetUpcoming(set, day, hoursAhead = 4) {
  const now = new Date()
  const start = parseSetTime(set.start, day)
  return start > now && start <= new Date(now.getTime() + hoursAhead * 60 * 60 * 1000)
}

export function isSetPast(set, day) {
  const now = new Date()
  const end = parseSetTime(set.end, day)
  return now > end
}

export function getTodayKey() {
  const today = new Date().toISOString().split('T')[0]
  const map = {
    '2026-04-09': 'thursday',
    '2026-04-10': 'friday',
    '2026-04-11': 'saturday',
    '2026-04-12': 'sunday',
  }
  return map[today] || 'thursday'
}
