import logoImg from '../assets/images/logo.svg';
import { useParams } from 'react-router';

import { Button } from '../componentes/Button';
import { RoomCode } from '../componentes/RoomCode';

import '../styles/room.scss';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

type RoomParams = {
    id: string;
}

export function Room() {
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const [ newQuestion, setNewQuestions ] = useState('');

    async function handleSendQuestions() {
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

        <form >
            <textarea
                placeholder="O que você quer perguntar?"
                onChange={event => setNewQuestions(event.target.value)}
                value={newQuestion}
            />

            <div className="form-footer">
                <span>Para enviar uma pergunta,<button>faça seu login</button>.</span>
                <Button type="submit">Enviar pergunta</Button>
            </div>
        </form>
         </main>
     </div>
    );
}