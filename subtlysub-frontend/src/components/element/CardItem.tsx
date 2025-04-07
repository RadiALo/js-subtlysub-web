const CardItem = ({ card }: { card: { word: string; translation: string } }) => {
  return (
    <div className="p-5 rounded-lg bg-purple-400 text-white shadow-lg shadow-purple-800/50">
      <div className="text-lg font-bold">{card.word}</div>
      <div className="text-white/80">{card.translation}</div>
    </div>
  );
};

export default CardItem;
