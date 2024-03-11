import React from 'react'
import {CustomInput, Button, Form, FormGroup, Label, Input} from 'reactstrap'

const initialFileState = {
  file: null,
  metaData1: '',
  metaData2: '',
  metaData3: '',
  metaData4: '',
  metaData5: '',
  metaData6: '',
  metaData7: '',
}

const reducer = (fileState, action) => {
  switch (action.type) {
    case 'readData':
      return {
        ...fileState,
        ...action.data,
      }
    case 'initialFile':
      return {
        ...fileState,
        file: null,
      }
    default:
      return initialFileState
  }
}

const Home = () => {
  const [fileState, dispatchFileState] = React.useReducer(
    reducer,
    initialFileState,
  )

  const handleFileClick = (e) => {
    e.target.value = ''
    dispatchFileState({type: 'initialFile', data: {}})
  }
  const handleFileChange = React.useCallback((e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      dispatchFileState({type: 'readData', data: {file: files[0]}})
    }
  }, [])

  const handleControls = (e) => {
    dispatchFileState({
      type: 'readData',
      data: {[e.target.name]: e.target.value},
    })
  }
  const handleChecked = (e) => {
    dispatchFileState({
      type: 'readData',
      data: {[e.target.name]: e.target.checked},
    })
  }

  const handleFormSubmit = (e) => {
    let formData = new FormData()

    for (const [key, value] of Object.entries(fileState)) {
      formData.append(key, value)
    }
    formData.set([fileState.file], fileState.file, fileState.file.name)

    fetch('https://localhost:44376/file', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .catch((error) => console.error('Error:', error))
      .then((response) => console.log('Success:', JSON.stringify(response)))
    console.log(fileState)
  }

  return (
    <Form>
      <FormGroup>
        <Label for="metaData1">Meta Data 1</Label>
        <Input
          name="metaData1"
          id="metaData1"
          placeholder="Meta Data 1 placeholder"
          onChange={handleControls}
        />
      </FormGroup>
      <FormGroup>
        <Label for="metaData2">Meta Data 2</Label>
        <Input
          name="metaData2"
          id="metaData2"
          placeholder="Meta Data 2 placeholder"
          onChange={handleControls}
        />
      </FormGroup>
      <FormGroup>
        <Label for="metaData3">Meta Data 3</Label>
        <Input
          type="select"
          name="metaData3"
          onClick={handleControls}
          id="metaData3"
        >
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
          <option>Option 4</option>
          <option>Option 5</option>
        </Input>
      </FormGroup>
      <FormGroup>
        <Label for="metaData4">Meta Data 4</Label>
        <Input
          type="textarea"
          name="metaData4"
          id="metaData4"
          onChange={handleControls}
        />
      </FormGroup>
      <FormGroup tag="fieldset">
        <legend>Meta Data 5</legend>
        <FormGroup check>
          <Label check>
            <Input
              type="radio"
              name="metaData5"
              value="Option one"
              onChange={handleControls}
            />
            Option one
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input
              type="radio"
              name="metaData5"
              value="Option two"
              onChange={handleControls}
            />
            Option two
          </Label>
        </FormGroup>
      </FormGroup>
      <FormGroup check>
        <Label check>
          <Input type="checkbox" name="metaData6" onClick={handleChecked} />
          Meta Data 6
        </Label>
      </FormGroup>
      <FormGroup>
        <Label for="file">File</Label>
        <CustomInput
          type="file"
          id="file"
          onChange={handleFileChange}
          onClick={handleFileClick}
          name="file"
          label="Pick a file!"
        />
      </FormGroup>

      <Button onClick={handleFormSubmit}>Submit</Button>
    </Form>
  )
}

export default Home
