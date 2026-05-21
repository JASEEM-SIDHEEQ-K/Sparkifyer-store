const QuantitySelector = ({ quantity, onIncrease, onDecrease, stock }) => {
  return (
    <div className="flex items-center gap-3">

      <span className="text-sm font-medium text-slate-700">
        Quantity:
      </span>

      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">

        {/* Decrease Button */}
        <button
          onClick={onDecrease}
          disabled={quantity <= 1}
          className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed text-lg font-medium"
        >
          −
        </button>

        {/* Quantity Display */}
        <span className="w-10 h-9 flex items-center justify-center text-sm font-semibold text-slate-800 border-x border-slate-300">
          {quantity}
        </span>

        {/* Increase Button */}
        <button
          onClick={onIncrease}
          disabled={quantity >= stock}
          className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed text-lg font-medium"
        >
          +
        </button>

      </div>

      {/* Stock Info */}
      <span className="text-xs text-slate-400">
        {stock} available
      </span>

    </div>
  );
};

export default QuantitySelector;