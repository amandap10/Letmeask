import logoImg from '../assets/images/logo.svg';
import { useParams } from 'react-router';

import { Button } from '../componentes/Button';
import { RoomCode } from '../componentes/RoomCode';

import '../styles/room.scss';
import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { For } from '@babel/types';
import { EventEmitter } from 'stream';
import { useEffect } from 'react';

type Firebase = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean
}>

type RoomParams = {
    id: string;
}

export function Room() {
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const [ newQuestion, setNewQuestions ] = useState('');

    const roomId = params.id;



    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.once('value', room => {
            const parsedQuestions = Object.entries(room.questions ?? {})
        })
    }, [roomId]);

    async function handleSendQuestions(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') {
            return;
        }

        if (!user) {
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name:user.name,
                avatar: user.avatar,
            },
            isHighLighted: false,
            isAnwered: false
        };

        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestions('');
    }

    return (
     <div id="page-room">
         <header>
             <div className="content">
                <img src={logoImg} alt="Letmeask" />
               <RoomCode code={roomId}/>
             </div>
         </header>

         <main>
        <div className="room-title">
        <h1>Sala de React</h1>
        <span>4 perguntas</span>
        </div>

        <form onSubmit={handleSendQuestions}>
            <textarea
                placeholder="O que você quer perguntar?"
                onChange={event => setNewQuestions(event.target.value)}
                value={newQuestion}
            />

            <div className="form-footer">
                { user ? (
                    <div className="user-info">
                        <img src={user.avatar} alt={user.name} />
                        <span>{user.name}</span>
                    </div>
                ) : (
                    <span>Para enviar uma pergunta,<button>faça seu login</button>.</span>
                ) }
                <Button type="submit" disabled={!user}>Enviar pergunta</Button>
            </div>
        </form>
         </main>
     </div>
    );
}