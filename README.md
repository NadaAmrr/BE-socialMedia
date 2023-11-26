# BE-socialMedia
This is a Node.js application that creates a social media platform with user authentication, post management, and comment management features. The application uses MongoDB as the database and includes APIs for user authentication, post management, and comment management. The application also includes a function that runs every day at 9:00 pm and sends a reminder email to all users who have not confirmed their emails to warn them about the potential for their accounts to be deleted.

"For more information on how to use the Social Media Platform API, please refer to the documentation at the following link <a href="https://documenter.getpostman.com/view/26559299/2s9YeD9ZNJ">Documentation</a>."

## Getting Started
To use the Social Media Platform API, you will need to sign up for an account and obtain an API key. You can then use the API to create posts, add comments, and manage user profiles.

## Features
The Social Media Platform API provides the following features:

- User authentication and authorization
- Post management (create, update, delete, get)
- Comment management (create, update, delete, get)
- Profile management (get, update, add profile picture, add cover picture)
- Email confirmation and password reset
- Pagination and sorting of posts and comments
- Error handling and validation

## Collections

| Collection | Fields | 
| --- | --- | 
| Users | - first name<br>- last name<br>- email<br>- password<br>- phone number<br>- age<br>- confirmation email<br>- deletion status | 
| Posts | - content<br>- images<br>- videos<br>- likes<br>- created by user<br>- comments<br>- privacy settings | 
| Comments | - content<br>- created by user<br>- post ID<br>- replies<br>- likes | 
| Reply | - content<br>- created by user<br>- comment ID<br>- likes |

User APIs
| API | Description | 
| --- | --- | 
| Sign Up | Allows users to sign up for the application by creating a new user account with a unique email address and password. The API hashes the password and encrypts the phone number using the crypto-js module. It also sends a confirmation email to the user to confirm their email address. | 
| Sign In | Allows users to sign in to the application with their email address and password. The API checks if the user is confirmed and not deleted. | | Get User Profile | Allows users to retrieve their own profile information. The API checks if the user is authenticated. | 
| Update Profile | Allows users to update their own profile information such as first name, last name, email, phone number, age, and password. The API checks if the user is authenticated and updates the confirmation email if the email address is updated. | 
| Add Profile Picture | Allows users to add a profile picture to their profile. The API checks if the user is authenticated and uploads the picture to the cloudinary service. | | Add Cover Picture | Allows users to add a cover picture to their profile. The API checks if the user is authenticated and adds the picture to the user's profile. | 
| Add Video | Allows users to add a video to a post. The API checks if the user is authenticated and uploads the video to the cloudinary service. | 
| Update Password | Allows users to update their password. The API checks if the user is authenticated and checks if the old password is correct. | 
| Soft Delete Profile | Allows the user to delete their own account. The API checks if the user is authenticated and sets the deletion status to true. | 
| Forget Password | Allows users to reset their password by sending a reset password email to their email address. The API checks if the user exists and generates a reset password token. | 
| Refresh Token | Allows users to refresh their authentication token. The API checks if the refresh token is valid and generates a new authentication token. |

Post APIs
| API | Description | 
| --- | --- | 
| Add Post | Allows users to add a new post to the application. The API checks if the user is authenticated and the post privacy settings allow the post to be public or the user is the post owner. | 
| Update Post | Allows users to update an existing post. The API checks if the user is authenticated and the post owner is the user who is updating the post. | 
| Delete Post | Allows users to delete an existing post. The API checks if the user is authenticated and the post owner is the user who is deleting the post. The API also deletes the post's comments and images from the cloudinary service. | 
| Get All Posts | Allows users to retrieve all posts. The API checks if the user is authenticated and the post privacy settings allow the post to be public or the user is the post owner. The API also returns the post's comments and the number of pages and current page. | 
| Get Post by ID | Allows users to retrieve a post by its ID. The API checks if the user is authenticated and the post privacy settings allow the post to be public or the user is the post owner. The API also returns the post's comments. | 
| Like Post | Allows users to like a post. The API checks if the user is authenticated and the user has not already liked the post. | | Unlike Post | Allows users to unlike a post. The API checks if the user is authenticated and the user has already liked the post. | 
| Update Post Privacy | Allows users to update the privacy settings of a post. The API checks if the user is authenticated and the post owner is the user who is updating the post. | 
| Get Posts Created Yesterday | Allows users to retrieve all posts created yesterday. The API checks if the user is authenticated and the post privacy settings allow the post to be public or the user is the post owner. The API also returns the post's comments , the number of pages and current page, next page and previous page. | 
| Get Posts Created Today | Allows users to retrieve all posts created today. The API checks if the user is authenticated and the post privacy settings allow the post to be public or the user is the post owner. The API also returns the post's comments and the number of pages and current page. |

Comment APIs
| API | Description | 
| --- | --- | 
| Add Comment | Allows users to add a new comment to a post. The API checks if the user is authenticated and the post privacy settings allow the post to be public or the user is the post owner. The API also checks if the post has been deleted. |
| Update Comment | Allows users to update an existing comment. The API checks if the user is authenticated and the comment owner is the user who is updating the comment. | 
| Delete Comment | Allows users to delete an existing comment. The API checks if the user is authenticated and the comment owner is the user who is deleting the comment. | 
| Like Comment | Allows users to like a comment. The API checks if the user is authenticated and the user has not already liked the comment. |
| Unlike Comment | Allows users to unlike a comment. The API checks if the user is authenticated and the user has already liked the comment. | 
| Add Reply | Allows users to add a new reply to a comment. The API checks if the user is authenticated and the comment privacy settings allow the comment to be public or the user is the comment owner. The API also checks if the comment has been deleted. | | Update Reply | Allows users to update an existing reply. The API checks if the user is authenticated and the reply owner is the user who is updating the reply. | | Delete Reply | Allows users to delete an existing reply. The API checks if the user is authenticated and the reply owner is the user who is deleting the reply. | 
| Like Reply | Allows users to like a reply. The API checks if the user is authenticated and the user has not already liked the reply. | 
| Unlike Reply | Allows users to unlike a reply. The API checks if the user is authenticated and the user has already liked the reply. |

## Functionality

The application includes a function that runs every day at 9:00 pm and sends a reminder email to all users who have not confirmed their emails to warn them about the potential for their accounts to be deleted. The function checks if the user has not confirmed their email within a certain time period and sends a reminder email to the user.

## Languages and Tools

The application is built using Node.js and includes the following dependencies:

<code><img height="40" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png"></code>
<code><img height="40" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/express/express.png"></code>
<code><img height="40" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/mongodb/mongodb.png"></code>

- Express 
- Mongoose
- Cloudinary
- Joi
- Crypto-js
- Nodemailer

## Usage
To use the Social Media Platform API, you can make HTTP requests to the API endpoints using a tool like Postman or cURL. The API follows the RESTful principles and returns JSON responses.

## License
The Social Media Platform API is licensed under the MIT License.



