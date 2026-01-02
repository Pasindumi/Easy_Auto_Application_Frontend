// Dummy chat data for testing chat UI
export const DUMMY_CHAT = [
  {
    id: 1,
    sender: 'Toyota Care',
    message: 'Hello, welcome to Toyota Care Official Store 😊',
    time: '09:41',
    type: 'received',
  },
  {
    id: 2,
    sender: 'Toyota Care',
    message: 'Is there anything we can do to help you? 😁😁😁',
    time: '09:42',
    type: 'received',
  },
  {
    id: 3,
    sender: 'You',
    message: 'Hi Good Morning. I want to buy a Toyota Prado Series.',
    time: '09:51',
    type: 'sent',
  },
  {
    id: 4,
    sender: 'You',
    message: 'My Previous Prado was too old and damaged, so I was looking into a new Jeep',
    time: '09:51',
    type: 'sent',
  },
  {
    id: 5,
    sender: 'You',
    message: '',
    images: [
      require('../../assets/images/car1.jpg'),
      require('../../assets/images/car3.jpg'),
    ],
    time: '09:51',
    type: 'sent',
  },
];
