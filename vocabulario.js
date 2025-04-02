// Datos de vocabulario para el juego de aprendizaje de coreano
const vocabularyData = {
    "LUGARES": [
        { korean: "집", pronunciation: "jip", spanish: "casa" },
        { korean: "편의점", pronunciation: "pyeonuijeom", spanish: "tienda de conveniencia" },
        { korean: "은행", pronunciation: "eunhaeng", spanish: "banco" },
        { korean: "병원", pronunciation: "byeongwon", spanish: "hospital" },
        { korean: "약국", pronunciation: "yakguk", spanish: "farmacia" },
        { korean: "교실", pronunciation: "gyosil", spanish: "aula" },
        { korean: "대학교", pronunciation: "daehakgyo", spanish: "universidad" },
        { korean: "영화관", pronunciation: "yeonghwagwan", spanish: "cine" },
        { korean: "극장", pronunciation: "geukjang", spanish: "teatro" },
        { korean: "백화점", pronunciation: "baekhwajeom", spanish: "grandes almacenes" },
        { korean: "가게", pronunciation: "gage", spanish: "tienda" },
        { korean: "식당", pronunciation: "sikdang", spanish: "restaurante" },
        { korean: "커피숍", pronunciation: "keopishop", spanish: "cafetería" },
        { korean: "카페", pronunciation: "kape", spanish: "café" },
        { korean: "술집", pronunciation: "suljip", spanish: "bar" }
    ],
    "UBICACIONES": [
        { korean: "한국", pronunciation: "hanguk", spanish: "Corea (del Sur)" },
        { korean: "서울", pronunciation: "seoul", spanish: "Seúl" },
        { korean: "부산", pronunciation: "busan", spanish: "Busan" },
        { korean: "마드리드", pronunciation: "madeuredeu", spanish: "Madrid" },
        { korean: "홍대", pronunciation: "hongdae", spanish: "Hongdae" },
        { korean: "이태원", pronunciation: "itaewon", spanish: "Itaewon" },
        { korean: "남산", pronunciation: "namsan", spanish: "Namsan" },
        { korean: "경복궁", pronunciation: "gyeongbokgung", spanish: "Palacio Gyeongbokgung" },
        { korean: "제주도", pronunciation: "jejudo", spanish: "Isla Jeju" }
    ],
    "NATURALEZA": [
        { korean: "바다", pronunciation: "bada", spanish: "mar" },
        { korean: "해변", pronunciation: "haebyeon", spanish: "playa" },
        { korean: "강", pronunciation: "gang", spanish: "río" },
        { korean: "산", pronunciation: "san", spanish: "montaña" },
        { korean: "공원", pronunciation: "gongwon", spanish: "parque" }
    ],
    "OBJETOS": [
        { korean: "우산", pronunciation: "usan", spanish: "paraguas" },
        { korean: "침대", pronunciation: "chimdae", spanish: "cama" },
        { korean: "의자", pronunciation: "uija", spanish: "silla" },
        { korean: "책상", pronunciation: "chaeksang", spanish: "escritorio" },
        { korean: "노트북", pronunciation: "noteubuk", spanish: "portátil" },
        { korean: "휴지통", pronunciation: "hyujitong", spanish: "papelera" },
        { korean: "그림", pronunciation: "geurim", spanish: "pintura" },
        { korean: "휴지", pronunciation: "hyuji", spanish: "papel higiénico" },
        { korean: "열쇠", pronunciation: "yeolsoe", spanish: "llave" },
        { korean: "시계", pronunciation: "sigye", spanish: "reloj" }
    ],
    "BEBIDAS": [
        { korean: "커피", pronunciation: "keopi", spanish: "café" },
        { korean: "물", pronunciation: "mul", spanish: "agua" },
        { korean: "맥주", pronunciation: "maekju", spanish: "cerveza" },
        { korean: "와인", pronunciation: "wain", spanish: "vino" },
        { korean: "오렌지주스", pronunciation: "orenjijuseu", spanish: "zumo de naranja" },
        { korean: "콜라", pronunciation: "kolla", spanish: "cola" },
        { korean: "녹차", pronunciation: "nokcha", spanish: "té verde" },
        { korean: "소주", pronunciation: "soju", spanish: "soju" }
    ],
    "EXPRESIONES": [
        { korean: "네", pronunciation: "ne", spanish: "sí" },
        { korean: "아니요", pronunciation: "aniyo", spanish: "no" },
        { korean: "미안해요", pronunciation: "mianhaeyo", spanish: "lo siento" },
        { korean: "괜찮아요", pronunciation: "gwaenchanayo", spanish: "está bien" },
        { korean: "감사합니다", pronunciation: "gamsahamnida", spanish: "gracias (formal)" },
        { korean: "고마워요", pronunciation: "gomawoyo", spanish: "gracias (informal)" },
        { korean: "안녕하세요", pronunciation: "annyeonghaseyo", spanish: "hola" },
        { korean: "안녕히 계세요", pronunciation: "annyeonghi gyeseyo", spanish: "adiós (a quien se queda)" }
    ]
};

// Función para obtener vocabulario según la categoría seleccionada
function getVocabularyByCategory(category) {
    if (category === "TODAS") {
        // Combinar todo el vocabulario
        let allVocabulary = [];
        for (const category in vocabularyData) {
            allVocabulary = [...allVocabulary, ...vocabularyData[category]];
        }
        return allVocabulary;
    } else {
        return vocabularyData[category];
    }
}

// Función para obtener un subconjunto aleatorio del vocabulario
function getRandomVocabulary(count, category) {
    const vocabulary = getVocabularyByCategory(category);
    const shuffled = [...vocabulary].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}