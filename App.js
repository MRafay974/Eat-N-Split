import { useState } from "react";

const initialFriends = [
  {
    id: 1,
    name: "Ali",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 2,
    name: "Ahmed",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 3,
    name: "Aurangzeb",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setfriends] = useState(initialFriends);
  const [showFormAddfriend, SetFormAddFriend] = useState(false);
  const [selectedfriend, setselectedfriend] = useState(null);

  function handleShowAddFriend() {
    SetFormAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setfriends((friends) => [...friends, friend]);
    SetFormAddFriend(false);
  }

  function handleSelection(friend) {
    //setselectedfriend(friend);
    setselectedfriend((curr) => (curr?.id === friend.id ? null : friend));
    SetFormAddFriend(false);
  }

  function handleSplitBill(value) {
    console.log(value);
    setfriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedfriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setselectedfriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedfriend={selectedfriend}
        />

        {showFormAddfriend && <FormAddfriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showFormAddfriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedfriend && (
        <FormSplitBill
          selectedfriend={selectedfriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedfriend }) {
  return (
    <ul>
      {friends.map((frand) => (
        <Friend
          friend={frand}
          key={frand.id}
          onSelection={onSelection}
          selectedfriend={selectedfriend} // it is simply is the passer thats why we say that this concept is prop drilling
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedfriend }) {
  const isSelected = friend.id === selectedfriend?.id; // optional chaining
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddfriend({ onAddFriend }) {
  const [name, setName] = useState();
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID(); // generating random ids wont work in older browzer

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <h4>Friend Name </h4>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <h4>Image URL </h4>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedfriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setpaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : ""; // derived state
  const [whoIsPaying, setwhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedfriend.name}</h2>

      <h4>Bill Value</h4>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <h4>Your Expense</h4>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setpaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <h4>{selectedfriend.name} Expense</h4>
      <input type="text" disabled value={paidByFriend} />

      <h4>Who is paying the bill</h4>
      <select
        value={whoIsPaying}
        onChange={(e) => setwhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedfriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
