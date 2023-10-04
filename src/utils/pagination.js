export const pagination = async(page, size , model) => {
    if (page <= 0 || !page) page = 1
    if (size <= 0 || !size) size = 5
    const skip = size * (page - 1)

  const total = await model.countDocuments();

    return { skip, limit: size , total}

     
}
