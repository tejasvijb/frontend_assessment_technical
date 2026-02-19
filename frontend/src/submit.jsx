// submit.js

export const SubmitButton = () => {

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Submit</button>
        </div>
    );
}
