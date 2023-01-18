import React, {useState} from "react";
import {TextInput, Button, Group} from '@mantine/core';
import {useForm} from '@mantine/form';
import {useForm as useForm2} from "react-hook-form";
import LoginOAuth2 from 'react-oauth2-login';

export default function SignInPage(props) {
    const {setError, formState: {errors}} = useForm2();
    const [value, setValue] = useState(0);

    const handleSubmitF = async (event) => {
        console.log('client/SignInPage/handleSubmitF/event: ', event)
        fetch('https://meme-project-server-ava.onrender.com/api/users/signin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: event.email,
                password: event.password,
            })
        })
            .then(async response => {
                if (response.status === 200) {
                    props.callbackSignInSuccess(await response.json());
                } else {
                    setError('email', {type: 'manual', message: 'email or password incorrect'});
                    // Refresh the UI
                    setValue(value + 1);
                    return {error: response.status};
                }
            })
            .catch(err => {
                    console.error('+ Error login: ', err);
                }
            );
    }

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) =>
                (value.toString().length > 4) ? null : 'Password to short'
            ,
        },
    });

    function onSignIn(googleUser) {
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    }

    const onSuccess = response => console.log('client google success: ', response);
    const onFailure = response => console.error('client google error: ', response);

    return (
        <div className="col-md-12">
            <h1 className="d-flex mt-2 justify-content-center">Sign-in</h1>
            <div className="card card-container">
                <img
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="profile-img"
                    className="profile-img-card"
                />
                <form onSubmit={form.onSubmit((values) => handleSubmitF(values))}>
                    <div className="form-group">
                        <TextInput
                            withAsterisk
                            label="Email"
                            placeholder="your@email.com"
                            {...form.getInputProps('email')}
                        />
                        {errors.email && <p className={"formMsgError"}>{errors.email.message}</p>}
                    </div>
                    <div className="form-group">
                        <TextInput
                            withAsterisk
                            label="Password"
                            placeholder="Your password"
                            {...form.getInputProps('password')}
                        />
                        {errors.email && <p className={"formMsgError"}>{errors.email.message}</p>}
                    </div>
                    <div className="form-group">
                        <Group position="center" mt="md">
                            <Button type="submit">Submit</Button>
                        </Group>
                    </div>
                    <div>{}</div>
                    <div className="g-signin2" data-onsuccess="onSignIn"></div>
                    <LoginOAuth2
                        clientId="476772010168-qcjl2r4gl2hudufipa1a8bc0nduj3567.apps.googleusercontent.com"
                        authorizeUri="https://mem-project-client-ava.netlify.app/"
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                    />,
                </form>
            </div>
        </div>
    );
}
