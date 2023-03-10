import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type RoomType = {
  id: number;
  name: string;
};

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<RoomType[] | []>([]);
  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase.from('rooms').select();
      if (error) throw error;
      setRooms(data);
      console.log(data);
    } catch (error) {
      alert(error);
      setRooms([]);
    }
  };
  useEffect(() => {
    fetchRooms();
  }, []);
  if (!rooms || rooms.length <= 0) {
    return <p>部屋が存在しません。</p>;
  }
  return (
    <>
      <ul>
        {rooms.map((room: RoomType) => (
          <li key={room.id}>{room.name}</li>
        ))}
      </ul>
    </>
  );
};

type MessageType = {
  id: number;
  room_id: number;
  user_id: number;
  content: string;
  created_at: any;
};

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[] | []>([]);
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase.from('messages').select();
      if (error) throw error;
      setMessages(data);
      console.log(messages);
    } catch (error) {
      alert(error);
      setMessages([]);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, []);
  if (!messages || messages.length <= 0) {
    return <p>まだメッセージが存在しません。</p>;
  }
  return (
    <div>
      {messages.map((message: MessageType) => (
        <p key={message.id}>{message.content}</p>
      ))}
    </div>
  );
};

const MessageForm: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const onSubmitMessageForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('messages').insert({
        room_id: 1,
        user_id: 1,
        content: message.toString(),
      });
      if (error) throw error;
      setMessage('');
    } catch (error) {
      alert(error);
    }
  };
  const onChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };
  return (
    <form action="post" onSubmit={onSubmitMessageForm}>
      <input
        type="text"
        id="Message"
        value={message}
        onChange={onChangeMessage}
      />
      <button type="submit">送信</button>
    </form>
  );
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Next Chat</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>Next Chat</h1>
      </header>
      <div className="content">
        <h2>
          <span>Rooms</span>
        </h2>
        <aside>
          {/* <div>
            <button>DM</button>
          </div> */}
          <Rooms />
        </aside>
        <main className={styles.main}>
          <div>
            <h2>
              <span>ダイレクトメッセージ</span>
              <button>+</button>
            </h2>
            <ul>
              <li>
                <a href="#">
                  <Image
                    src="./icon/icon_seal.svg"
                    alt=""
                    width="80"
                    height="80"
                  />
                </a>
                <button>×</button>
              </li>
            </ul>
          </div>

          <div>
            <div>
              <Messages />
              <MessageForm />
            </div>
            <div>profile area</div>
          </div>
        </main>
      </div>
      <footer>
        icon download from&ensp;
        <a href="http://flat-icon-design.com/?tag=animal">here</a>
      </footer>
    </>
  );
}
