import React, { FormEvent } from 'react'
import './css/Popupwindow.css'
import axios from 'axios'
import $ from 'jquery'
import { useDispatch } from 'react-redux';
import { increment } from '../Action';


interface storyList {
          story: string,
          
}


const Popupwindow: React.FC = () => {
          const dispatch = useDispatch();
          
         
          const [storyBody, setstoryBody] = React.useState<storyList>({ story: '' })


          
          const add_story = (e: FormEvent<HTMLFormElement>) => {
                    e.preventDefault()
             
                    axios.post('/story/addstory',  storyBody , {
                              withCredentials: true
                    }).then(() => {
                              dispatch(increment())
                             
                           
                              setstoryBody({
                                        story: ''

                              })
                              $('.story-det').val('')
                              $('#float-window').toggleClass('none')
                              $('#post-window').toggleClass('back-blur')

                    }).catch((e) => {
                              console.log(e)
                    })



          }





          return (
                    <React.Fragment>
                              <h1 id='p-head'> Create your own story and Add keywords</h1>
                          <form className='form-add-story' onSubmit={add_story}>
                                        <h3>Write a story</h3>
                                        <textarea  name='line' required  cols={30} rows={10} className='story-det' onChange={(e) => {
                                                  setstoryBody({story:e.target.value})
                                        }}></textarea>
                                        <button type='submit'>Generate story</button>

                              </form>
                              



                    </React.Fragment>
          )
}

export default Popupwindow
