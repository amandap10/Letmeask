import { useHistory, useParams } from 'react-router';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import { Button } from '../componentes/Button';
import { Question } from '../componentes/Questions';
import { RoomCode } from '../componentes/RoomCode';
//import { useAuth } from '../hooks/useAuth';
import '../styles/room.scss';


import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';


type RoomParams = {
    id: string;
}

export function AdminRoom() {
    //const { user } = useAuth();
    const history = useHistory()
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const { title, questions } = useRoom(roomId);

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endeAt: new Date(),
        })

        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string){
       if (window.confirm('Você tem certeza que deseja excluir essa pergunta?')){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
       }
    }


    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                     <h1>Sala {title}</h1>
                     { questions.length > 0 && <span>{questions.length} perguntas</span>}
                </div>
                
                <div className="question-List">
                    { questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            >
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt={"Remover pergunta"} />
                                </button>

                            </Question>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}