import React, { useEffect, useRef, useState } from 'react';

const PLAYER_COLORS = [
  '#FF5733', // כתום-אדום
  '#33A8FF', // כחול
  '#33FF57', // ירוק
  '#D433FF', // סגול
  '#FFDD33', // צהוב
  '#FF33A2', // ורוד
];

// יצירת סוגי טריטוריות פחות סימטריות
const TERRITORY_SHAPES = [
  { name: 'מערב אירופה', points: [[0.3, 0.3], [0.2, 0.4], [0.25, 0.5], [0.35, 0.45]] },
  { name: 'מזרח אירופה', points: [[0.4, 0.3], [0.35, 0.45], [0.45, 0.5], [0.5, 0.35]] },
  { name: 'צפון אפריקה', points: [[0.25, 0.5], [0.2, 0.65], [0.35, 0.7], [0.45, 0.5]] },
  { name: 'מזרח תיכון', points: [[0.5, 0.35], [0.45, 0.5], [0.55, 0.6], [0.65, 0.45]] },
  { name: 'רוסיה', points: [[0.5, 0.2], [0.4, 0.3], [0.5, 0.35], [0.65, 0.45], [0.7, 0.3]] },
  { name: 'אסיה מרכזית', points: [[0.65, 0.45], [0.55, 0.6], [0.7, 0.7], [0.8, 0.5]] },
  { name: 'דרום אסיה', points: [[0.7, 0.5], [0.65, 0.6], [0.75, 0.7], [0.85, 0.6]] },
  { name: 'דרום אפריקה', points: [[0.35, 0.7], [0.3, 0.85], [0.45, 0.8], [0.4, 0.65]] },
  { name: 'אוסטרליה', points: [[0.8, 0.7], [0.7, 0.8], [0.85, 0.85], [0.9, 0.75]] },
  { name: 'צפון אמריקה', points: [[0.1, 0.3], [0.05, 0.45], [0.15, 0.55], [0.2, 0.4]] },
];

const CircularMap = ({ usersInGame, currentUserId, onScoreUpdate }) => {
  const canvasRef = useRef(null);
  const [territories, setTerritories] = useState([]);
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [targetTerritory, setTargetTerritory] = useState(null);
  const [attackInProgress, setAttackInProgress] = useState(false);
  const [animationParticles, setAnimationParticles] = useState([]);
  const animationRef = useRef(null);
  
  // יצירת הטריטוריות במפה
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.45;
    
    // המרת ה TERRITORY_SHAPES לטריטוריות עם נקודות אמיתיות על הקנבס
    const processedTerritories = TERRITORY_SHAPES.map((shape, index) => {
      const processedPoints = shape.points.map(point => ({
        x: centerX + (point[0] - 0.5) * width,
        y: centerY + (point[1] - 0.5) * height
      }));
      
      // חישוב מרכז הטריטוריה
      const centerPoint = {
        x: processedPoints.reduce((sum, p) => sum + p.x, 0) / processedPoints.length,
        y: processedPoints.reduce((sum, p) => sum + p.y, 0) / processedPoints.length
      };
      
      return {
        id: index,
        name: shape.name,
        points: processedPoints,
        center: centerPoint
      };
    });
    
    setTerritories(processedTerritories);
    
    // אתחול המערכים אם עדיין לא קיימים
    usersInGame.forEach(user => {
      if (!user.scoreAsArrey || user.scoreAsArrey.length !== processedTerritories.length) {
        const newScoreArray = new Array(processedTerritories.length).fill(0);
        
        // הענקת 15 נקודות התחלתיות לטריטוריה אחת לכל משתמש
        const userIndex = usersInGame.findIndex(u => u._id === user._id);
        if (userIndex !== -1) {
          const startingTerritory = userIndex % processedTerritories.length;
          newScoreArray[startingTerritory] = 15;
          
          if (onScoreUpdate) {
            onScoreUpdate(user._id, newScoreArray);
          }
        }
      }
    });
    
  }, [canvasRef.current, usersInGame.length]);
  
  // ציור המפה
  useEffect(() => {
    if (!canvasRef.current || !territories.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // ניקוי הקנבס
    ctx.clearRect(0, 0, width, height);
    
    // ציור המעגל החיצוני
    ctx.beginPath();
    ctx.arc(width/2, height/2, Math.min(width, height) * 0.45, 0, Math.PI * 2);
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // הוספת טקסטורה למעגל (כמו מפת עולם)
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.min(width, height) * 0.45);
    gradient.addColorStop(0, 'rgba(200, 230, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(200, 230, 255, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // ציור כל טריטוריה
    territories.forEach(territory => {
      // מציאת השחקן עם הניקוד הגבוה ביותר בטריטוריה הזו
      let maxScore = 0;
      let maxScoreUser = null;
      
      usersInGame.forEach(user => {
        if (user.scoreAsArrey && user.scoreAsArrey[territory.id] > maxScore) {
          maxScore = user.scoreAsArrey[territory.id];
          maxScoreUser = user;
        }
      });
      
      // קביעת צבע לפי בעלות
      let color = '#CCCCCC'; // אפור כברירת מחדל
      if (maxScoreUser) {
        const userIndex = usersInGame.findIndex(u => u._id === maxScoreUser._id);
        color = PLAYER_COLORS[userIndex % PLAYER_COLORS.length];
      }
      
      // בניית מסלול לטריטוריה
      ctx.beginPath();
      ctx.moveTo(territory.points[0].x, territory.points[0].y);
      
      // חיבור כל הנקודות
      territory.points.forEach((point, index) => {
        if (index > 0) {
          ctx.lineTo(point.x, point.y);
        }
      });
      
      // סגירת המסלול
      ctx.closePath();
      
      // צביעה והדגשה
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7; // שקיפות חלקית
      ctx.fill();
      ctx.globalAlpha = 1.0;
      
      // הדגשת הטריטוריה הנבחרת או מטרה
      if (territory.id === selectedTerritory) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
      } else if (territory.id === targetTerritory) {
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
      }
      ctx.stroke();
      
      // הצגת מספר הנקודות
      if (maxScore > 0) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(maxScore.toString(), territory.center.x, territory.center.y);
        
        // הצגת שם השחקן
        if (maxScoreUser) {
          ctx.font = '12px Arial';
          ctx.fillText(maxScoreUser.username, territory.center.x, territory.center.y - 20);
        }
        
        // הצגת שם הטריטוריה
        ctx.font = '10px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(territory.name, territory.center.x, territory.center.y + 20);
      }
    });
    
    // ציור קו תקיפה אם יש טריטוריה נבחרת ומטרה
    if (selectedTerritory !== null && targetTerritory !== null) {
      const source = territories.find(t => t.id === selectedTerritory);
      const target = territories.find(t => t.id === targetTerritory);
      
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.center.x, source.center.y);
        ctx.lineTo(target.center.x, target.center.y);
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    
    // ציור חלקיקי אנימציה
    if (animationParticles.length > 0) {
      animationParticles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
    }
    
  }, [territories, usersInGame, selectedTerritory, targetTerritory, animationParticles]);
  
  // אנימציית התקפה
  useEffect(() => {
    if (attackInProgress && selectedTerritory !== null && targetTerritory !== null) {
      const source = territories.find(t => t.id === selectedTerritory);
      const target = territories.find(t => t.id === targetTerritory);
      
      if (source && target) {
        // מציאת השחקן התוקף
        const currentUser = usersInGame.find(user => user._id === currentUserId);
        const userIndex = usersInGame.findIndex(user => user._id === currentUserId);
        const attackColor = PLAYER_COLORS[userIndex % PLAYER_COLORS.length];
        
        // יצירת חלקיקים לאנימציה
        const numParticles = 20;
        const newParticles = [];
        
        for (let i = 0; i < numParticles; i++) {
          newParticles.push({
            x: source.center.x,
            y: source.center.y,
            targetX: target.center.x,
            targetY: target.center.y,
            progress: 0,
            speed: 0.01 + Math.random() * 0.02,
            color: attackColor
          });
        }
        
        setAnimationParticles(newParticles);
        
        // התחלת אנימציה
        const animate = () => {
          setAnimationParticles(prevParticles => {
            const updatedParticles = prevParticles.map(particle => {
              particle.progress += particle.speed;
              
              if (particle.progress >= 1) {
                return null; // סיום אנימציה לחלקיק זה
              }
              
              // חישוב מיקום חדש
              particle.x = particle.x + (particle.targetX - particle.x) * particle.speed;
              particle.y = particle.y + (particle.targetY - particle.y) * particle.speed;
              
              return particle;
            }).filter(Boolean); // סינון חלקיקים שסיימו
            
            // בדיקה אם האנימציה הסתיימה
            if (updatedParticles.length === 0) {
              setAttackInProgress(false);
              setSelectedTerritory(null);
              setTargetTerritory(null);
              
              // ביצוע ההתקפה בפועל
              executeAttack(selectedTerritory, targetTerritory);
              
              return [];
            }
            
            return updatedParticles;
          });
          
          animationRef.current = requestAnimationFrame(animate);
        };
        
        animationRef.current = requestAnimationFrame(animate);
        
        return () => {
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
        };
      }
    }
  }, [attackInProgress, selectedTerritory, targetTerritory]);
  
  // ביצוע ההתקפה
  const executeAttack = (sourceId, targetId) => {
    // מציאת המשתמש התוקף
    const currentUser = usersInGame.find(user => user._id === currentUserId);
    if (!currentUser || !currentUser.scoreAsArrey) return;
    
    // כוח ההתקפה (חצי מהכוחות בטריטוריה התוקפת)
    const attackPower = Math.floor(currentUser.scoreAsArrey[sourceId] / 2);
    
    // בדיקה שיש מספיק כוח להתקפה
    if (attackPower < 2) return;
    
    // העתקת מערך הנקודות
    const newScoreArray = [...currentUser.scoreAsArrey];
    
    // הפחתת כוחות מהטריטוריה התוקפת
    newScoreArray[sourceId] -= attackPower;
    
    // בדיקה מי הבעלים של הטריטוריה המותקפת
    let maxScore = 0;
    let defenderId = null;
    
    usersInGame.forEach(user => {
      if (user.scoreAsArrey && user.scoreAsArrey[targetId] > maxScore) {
        maxScore = user.scoreAsArrey[targetId];
        defenderId = user._id;
      }
    });
    
    // אם זו טריטוריה ריקה או של התוקף
    if (maxScore === 0 || defenderId === currentUserId) {
      // הוספת כוחות לטריטוריה
      newScoreArray[targetId] += attackPower;
    } else {
      // התקפה על טריטוריה של שחקן אחר
      const defenseStrength = maxScore;
      
      // התוצאה תלויה בהפרש הכוחות
      if (attackPower > defenseStrength) {
        // התקפה הצליחה
        const remainingForces = attackPower - defenseStrength;
        
        // מציאת המגן
        const defenderIndex = usersInGame.findIndex(user => user._id === defenderId);
        if (defenderIndex !== -1) {
          // העתקת המשתמשים
          const updatedUsers = [...usersInGame];
          
          // עדכון הטריטוריה המותקפת אצל המגן
          const defenderScoreArray = [...updatedUsers[defenderIndex].scoreAsArrey];
          defenderScoreArray[targetId] = 0;
          
          // העברת הטריטוריה לתוקף
          newScoreArray[targetId] = remainingForces;
          
          // עדכון המגן
          if (onScoreUpdate) {
            onScoreUpdate(defenderId, defenderScoreArray);
          }
        }
      }
      // אם ההתקפה נכשלה, לא קורה כלום - הכוחות שנשלחו להתקפה פשוט נעלמים
    }
    
    // עדכון התוקף
    if (onScoreUpdate) {
      onScoreUpdate(currentUserId, newScoreArray);
    }
  };
  
  // טיפול בלחיצות
  const handleClick = (e) => {
    if (attackInProgress) return; // לא לאפשר לחיצות בזמן אנימציה
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // בדיקה איזו טריטוריה נלחצה
    let clickedTerritoryId = null;
    
    for (let i = 0; i < territories.length; i++) {
      if (isPointInTerritory({ x, y }, territories[i])) {
        clickedTerritoryId = territories[i].id;
        break;
      }
    }
    
    if (clickedTerritoryId === null) {
      // לחיצה על רקע ריק - איפוס הבחירה
      setSelectedTerritory(null);
      setTargetTerritory(null);
      return;
    }
    
    // מציאת בעל הטריטוריה
    let ownerId = null;
    let maxScore = 0;
    
    usersInGame.forEach(user => {
      if (user.scoreAsArrey && user.scoreAsArrey[clickedTerritoryId] > maxScore) {
        maxScore = user.scoreAsArrey[clickedTerritoryId];
        ownerId = user._id;
      }
    });
    
    // אם אין טריטוריה נבחרת, זו הבחירה הראשונה
    if (selectedTerritory === null) {
      // שחקן יכול לבחור רק טריטוריה שלו
      if (ownerId === currentUserId) {
        setSelectedTerritory(clickedTerritoryId);
      }
    } 
    // אם יש כבר טריטוריה נבחרת, זו טריטוריית המטרה
    else if (selectedTerritory !== clickedTerritoryId) {
      setTargetTerritory(clickedTerritoryId);
      
      // התחלת אנימציית תקיפה
      setAttackInProgress(true);
    } 
    // לחיצה על אותה טריטוריה - ביטול הבחירה
    else {
      setSelectedTerritory(null);
    }
  };
  
  // בדיקה אם נקודה בתוך טריטוריה
  const isPointInTerritory = (point, territory) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(territory.points[0].x, territory.points[0].y);
    
    territory.points.forEach((p, index) => {
      if (index > 0) ctx.lineTo(p.x, p.y);
    });
    
    ctx.closePath();
    
    return ctx.isPointInPath(point.x, point.y);
  };
  
  return (
    <div className="circular-map">
      <canvas 
        ref={canvasRef} 
        width={700} 
        height={700} 
        onClick={handleClick}
        style={{ 
          border: '1px solid #ccc',
          borderRadius: '50%',
          backgroundColor: '#f0f0f0',
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)'
        }}
      />
      
      <div className="controls" style={{ marginTop: '10px', marginBottom: '10px' }}>
        {selectedTerritory !== null && (
          <div className="attack-info" style={{ 
            padding: '5px 10px', 
            backgroundColor: '#f8f8f8', 
            borderRadius: '5px',
            border: '1px solid #ddd'
          }}>
            <p>טריטוריה נבחרה: {territories[selectedTerritory]?.name}</p>
            <p>בחר טריטוריה נוספת לתקיפה</p>
          </div>
        )}
      </div>
      
      <div className="players-info" style={{ marginTop: '10px' }}>
        {usersInGame.map((user, index) => {
          // חישוב סכום הנקודות
          const totalScore = user.scoreAsArrey ? 
            user.scoreAsArrey.reduce((a, b) => a + b, 0) : 0;
          
          // ספירת טריטוריות
          const territoriesCount = user.scoreAsArrey ? 
            user.scoreAsArrey.filter(score => score > 0).length : 0;
          
          return (
            <div key={user._id} style={{ 
              display: 'inline-block', 
              margin: '5px',
              padding: '8px 15px',
              backgroundColor: PLAYER_COLORS[index % PLAYER_COLORS.length],
              color: 'white',
              borderRadius: '5px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontWeight: 'bold' }}>{user.username}</div>
              <div>נקודות: {totalScore}</div>
              <div>טריטוריות: {territoriesCount}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CircularMap;