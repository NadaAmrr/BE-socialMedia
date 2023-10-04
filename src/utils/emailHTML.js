export const linkBtn = (link, buttonLinkName, message) => {
  return `
  <tr>
  <td style="padding: 10px 0px; ">
      <p>${message}</p>
  </td>
</tr>
<tr>
  <td style="padding: 30px 0px; ">
      <a href="${link}"
          style="margin:0px 0px 0px 0px;border-radius:4px;padding:10px 20px;text-decoration: none; border: 0;color:#fff;background-color:#bb4120; ">${buttonLinkName}</a>
  </td>
</tr>
`;
};
export const createHtml = (firstLink, secondLink, unsubscribe, txt) => {
  return `
<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<style type="text/css">
    body {
        background-color: #fff;
        margin: 0px;
    }
</style>

<body style="margin:0px;">
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #bb4120;">
        <tr>
            <td>
                <table border="0" width="100%">
                    <tr>
                        <td>
                            <h1>
                            </h1>
                        </td>
                        <td>
                            <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank"
                                    style="text-decoration: none;">View In Website</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table border="0" cellpadding="0" cellspacing="0"
                    style="text-align:center;width:100%;background-color: #fff;">
                    
                    <tr>
                        <td>
                            <h1 style="padding-block:30px; color:#bb4120; background-color: #d9cecb;">${txt}</h1>
                        </td>
                    </tr>
                   ${firstLink}
                   ${secondLink}
                   ${unsubscribe}
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                    <tr>
                        <td>
                            <h3 style="margin-top:30px; color:#000">Stay in touch</h3>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="margin-top:0px;">
                                <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit"
                                        style="padding:10px 9px;color:#fff;border-radius:50%;">
                                        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png"
                                            width="50px" hight="50px"></span></a>
                                <a href="${process.env.instagramLink}" style="text-decoration: none;"><span class="twit"
                                        style="padding:10px 9px;color:#fff;border-radius:50%;">
                                        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png"
                                            width="50px" hight="50px"></span>
                                </a>
                                <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit"
                                        style="padding:10px 9px;;color:#fff;border-radius:50%;">
                                        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png"
                                            width="50px" hight="50px"></span>
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
