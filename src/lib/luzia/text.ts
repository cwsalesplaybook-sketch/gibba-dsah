// Processamento de texto em português para a busca da Luzia (sem IA externa).

const STOPWORDS = new Set(
  (
    "a o as os um uma uns umas de do da dos das em no na nos nas por para pra pro com sem sobre entre " +
    "e ou mas que se como qual quais quando onde quem quanto quantos quantas isso isto esse essa esses essas " +
    "este esta estes estas aquele aquela meu minha seu sua dele dela ao aos me te lhe mais menos muito muita " +
    "muitos muitas ja tambem so ainda entao pois porque ate depois antes vou vai vamos pode posso podem preciso " +
    "gostaria quero queria explique explica diga fale mostre conta contar falar dizer saber sabe sabem " +
    "ser sao foi eh era tem ter tenho tinha ha estar esta estao fazer faz feito ficar fica tipo coisa " +
    "algum alguma alguns algumas qualquer todo toda todos todas cada outro outra outros outras mesmo mesma " +
    "funciona funcionam significa mensagem mensagens template templates la aqui ali ai onde aonde ne ok oi ola bom boa dia tarde noite obrigado obrigada por favor"
  ).split(/\s+/)
);

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

// Stemmer leve: junta plurais e terminações comuns (comissões/comissão, cadastrar/cadastro...).
const SUFFIXES = [
  "amentos", "amento", "imentos", "imento", "adoras", "adores", "adora", "ador",
  "idades", "idade", "acoes", "acao", "avel", "aveis", "ismos", "ismo", "istas", "ista",
  "ando", "endo", "indo", "aram", "eram", "iram", "arao", "erao", "irao",
  "ados", "adas", "ado", "ada", "idos", "idas", "ido", "ida", "ivos", "ivas", "ivo", "iva",
  "antes", "ante", "ou", "ar", "er", "ir", "es", "s", "a", "o", "e",
];

export function stem(word: string) {
  let w = word;
  if (w.length <= 3) return w;
  w = w.replace(/(coes|oes|aes)$/, "ao").replace(/ais$/, "al").replace(/eis$/, "el").replace(/ns$/, "m");
  w = w.replace(/mente$/, "");
  for (const suffix of SUFFIXES) {
    if (w.endsWith(suffix) && w.length - suffix.length >= 4) {
      w = w.slice(0, -suffix.length);
      break;
    }
  }
  // Truncar em 6 letras junta a família da palavra (comissão, comissionamento, comissionar...).
  return w.slice(0, 6);
}

export function tokenize(text: string) {
  return normalize(text)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
    .map(stem);
}

export function commonPrefix(a: string, b: string) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

// Distância de edição (limitada), para tolerar erros de digitação.
export function editDistance(a: string, b: string, max = 2) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let last = prev[0];
    prev[0] = i;
    let rowMin = prev[0];
    for (let j = 1; j <= b.length; j++) {
      const temp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
      last = temp;
      rowMin = Math.min(rowMin, prev[j]);
    }
    if (rowMin > max) return max + 1;
  }
  return prev[b.length];
}

export function jaccard(a: string[], b: string[]) {
  const sa = new Set(a);
  const sb = new Set(b);
  if (sa.size === 0 || sb.size === 0) return 0;
  let inter = 0;
  for (const item of sa) if (sb.has(item)) inter++;
  return inter / (sa.size + sb.size - inter);
}
