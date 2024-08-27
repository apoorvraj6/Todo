import TodoList from '../components/TodoList';


export default function HomePage() {


  return (

    <div>
      
      <h1 className=" bg-white p-4 pl-8 font-semibold mt-7 text-4xl ">Todo</h1>

      
      <div className="p-4  gap-4">
      <div>
        
        <TodoList  />
      </div>
      
    </div>
    </div>
  );
}