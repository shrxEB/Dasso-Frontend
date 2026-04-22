
const StatCard = ({title, value}: any) => {
  return (
    <div className="bg-[#242424] rounded-xl
    p-4 border-[#2A2A2A]">
        <p className="text-sm text-gray-400">
        {title}</p>
        <h2 className="text-xl md:text-2xl font-semibold">{value}</h2>   
    </div>
  )
}

export default StatCard
