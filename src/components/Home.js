import Form from './Form.js';
import tree from '../assets/tree.png';
import tree2 from '../assets/tree2.png';

function Home() {
  return (
    <main>
      <div className="imgContainer">
        <img src={tree} alt="tree" className="tree" />
      </div>
      <div className="imgContainer2">
        <img src={tree2} alt="tree" className="tree" />
      </div>
      <section className='homePage'>
        <div className="wrapper">
          <Form />
          <div className="definition">
            <p>A haiku is a tradition Japanese three-line poem with seventeen syllables, written in a <span>5/7/5</span> syllable count. Often focusing on images from nature, haiku emphasizes simplicity, intensity, and directness of expression.</p>
          </div>
        </div>
      </section>
    </main>
    
  )
  
}

export default Home;