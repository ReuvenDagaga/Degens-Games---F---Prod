import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext';
import { useRoom } from '../../../context/RoomsContext';
import { getUserById } from '../../../services/userServices';
import CircularMap from './CircularMap';

export default function BitcoinConquestPage() {
    const { user, setUser } = useAuth();
    const { contextRoom, setcontextRoom } = useRoom();
    const [usersInGame, setUsersInGame] = useState([]);
    const [date, setDate] = useState(new Date());
    const [gameStatus, setGameStatus] = useState('waiting'); // waiting, playing, finished

    // עדכון השעה בכל שנייה
    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);        
        return () => clearInterval(timer);
    }, []);    
    
    // טעינת המשתמשים בחדר
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const tempUsers = [];
                
                for (let i = 0; i < contextRoom.users.length; i++) {
                    const userResponse = await getUserById(contextRoom.users[i]);
                    
                    if (userResponse && userResponse.data) {
                        tempUsers.push(userResponse.data);
                    }
                }
                
                setUsersInGame(tempUsers);
                
                // התחלת המשחק אם יש לפחות 2 שחקנים
                if (tempUsers.length >= 2 && gameStatus === 'waiting') {
                    setGameStatus('playing');
                }
            } catch (error) {
                console.error("שגיאה בטעינת המשתמשים:", error);
            }
        };
        
        if (contextRoom && contextRoom.users && contextRoom.users.length > 0) {
            fetchUsers();
            console.log(usersInGame)
            
        }
    }, [contextRoom, gameStatus]);

    // כל 3 שניות, עדכון נתוני המשחק מהשרת (זה סימולציה, בפועל תשתמש ב-WebSocket)
    useEffect(() => {
        if (gameStatus !== 'playing') return;

        const gameUpdateInterval = setInterval(() => {
            // כאן תבצע עדכון מהשרת
            // לדוגמה:
            // fetchGameState(contextRoom._id);
        }, 3000);
        
        return () => clearInterval(gameUpdateInterval);
    }, [gameStatus, contextRoom]);

    const handleScoreUpdate = async () => {
        console.log(111);
        
    }

    return (
        <div className="bitcoin-conquest-container">
            <h2>Bitcoin Conquest Game</h2>
            <div className="game-status">
                <div>מצב משחק: {gameStatus === 'waiting' ? 'ממתין לשחקנים' : gameStatus === 'playing' ? 'משחק פעיל' : 'המשחק הסתיים'}</div>
                <div>זמן: {date.toLocaleTimeString()}</div>
                <div>שחקנים: {usersInGame.length}</div>
            </div>
            
            {/* רינדור המפה רק כאשר המשחק פעיל ויש שחקנים */}
            {gameStatus === 'playing' && usersInGame.length > 0 && (
                <CircularMap 
                    usersInGame={usersInGame} 
                    currentUserId={user._id}
                    onScoreUpdate={handleScoreUpdate} 
                />
            )}
            
            {/* המתנה לשחקנים אם המשחק עדיין לא התחיל */}
            {gameStatus === 'waiting' && (
                <div className="waiting-screen">
                    <h3>ממתין לשחקנים נוספים...</h3>
                    <p>מספר שחקנים נדרש: לפחות 2</p>
                    <p>שחקנים כרגע: {usersInGame.length}</p>
                </div>
            )}
        </div>
    )
}