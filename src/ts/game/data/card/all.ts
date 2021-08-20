const modules = import.meta.globEager('./data/*') as Record<string, { default: CardData }>;

export interface CardData {
  timeAccur: Record<number, {
    
  }>
}

const CardDatas: CardData[] = [];
for (const [filepath, { default: data }] of Object.entries(modules)) {
  const index = Number(filepath.match(/(\d+)/g)![0]);
  CardDatas[index] = data;
}

export { CardDatas };