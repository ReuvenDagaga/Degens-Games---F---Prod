import React, { useState } from 'react';

/**
 * RiskBoard הוא קומפוננט React אחד שמכיל את כל הוויזואליות הבסיסית של לוח משחק דמוי ריסק.
 * בקוד זה כל "טריטוריה" מיוצגת באמצעות <path> (בתוך SVG), וניתן להרחיב עם כל
 * לוגיקה נוספת - כמו הקצאת חיילים, צביעת טריטוריות לפי שחקן, וכדומה.
 */
function RiskBoard() {
  // ניצור state שמייצג איזו טריטוריה "מסומנת" כרגע, לדוגמה
  const [selectedTerritory, setSelectedTerritory] = useState(null);

  // פונקציה לטיפול בלחיצה על טריטוריה
  const handleTerritoryClick = (territoryName) => {
    setSelectedTerritory(territoryName);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>דוגמה ללוח בסגנון "ריסק" בקומפוננטת React יחידה</h2>
      <p>טריטוריה נבחרת: {selectedTerritory || 'עדיין לא נבחרה'}</p>

      {/* ה-SVG יכול להכיל צורות (Paths / Polygons / וכו') המייצגות אזורים שונים במפה */}
      <svg
        viewBox="0 0 800 500"
        style={{
          width: '80%',
          height: 'auto',
          border: '1px solid black',
          cursor: 'pointer'
        }}
      >
        {/* דוגמה ל"יבשות" או "טריטוריות" - כאן צריך לעדכן את ה-d של כל path בהתאם למפתך */}
        <path
          d="M100,100 L200,100 L200,200 L100,200 Z" // ריבוע פשוט
          fill="#ccc"
          stroke="black"
          strokeWidth="2"
          onClick={() => handleTerritoryClick('North Territory')}
        />
        <path
          d="M210,100 L310,100 L310,200 L210,200 Z" // ריבוע צמוד
          fill="#aaf"
          stroke="black"
          strokeWidth="2"
          onClick={() => handleTerritoryClick('East Territory')}
        />
        <path
          d="M100,210 L200,210 L200,310 L100,310 Z" // ריבוע צמוד
          fill="#faa"
          stroke="black"
          strokeWidth="2"
          onClick={() => handleTerritoryClick('South Territory')}
        />
        <path
          d="M210,210 L310,210 L310,310 L210,310 Z" // ריבוע צמוד
          fill="#afa"
          stroke="black"
          strokeWidth="2"
          onClick={() => handleTerritoryClick('West Territory')}
        />

        {/* אפשר כמובן להוסיף עוד territories כרצונך */}
      </svg>

      <p style={{ fontStyle: 'italic', marginTop: '1rem' }}>
        זו רק המחשה גנרית. כדי לקבל מראה "ריסק" אמיתי, צריך להשתמש בגרפיקה מפורטת או תמונה ברישיון מתאים.
      </p>
    </div>
  );
}

export default RiskBoard;
