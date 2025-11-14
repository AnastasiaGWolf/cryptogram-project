// login, password, role

const bcrypt = require('bcrypt');
const { User } = require('../../models');

exports.addNewUser = async ({
  login, password
}) => {
  try {
    const userExists = await User.findOne({
      where: {login}
    });

    if (userExists) {
      return { msg: 'Пользователь существует' }
    };
    
    const hash = await bcrypt.hash(password, 7);
    const newUser = await User.create({
      login, password: hash
    });

    return newUser;
  } catch (error) {
    return { msgError: `Ошибка добавления нового пользователя: ${error}`};
  }
}

exports.loginUser = async ({
  login, password
}) => {
  try {
    const user = await User.findOne({
      where: { login }
    });

    if(!user) {
      return {msg: 'Пользователь с таким логином не найден'}
    };

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return { msg: 'Неверный пароль' }
    };

    return user;
  } catch (error) {
    return { msgError: `Ошибка входа в аккаунт: ${error}`}
  }
}

exports.updateUser = async ({
  id, updatedData
}) => {
  try {
    const updatedUser = await User.update(
      {updatedData}, 
      {where: {id}}
    );
    if (!updatedUser[0]) {
      return { msg: 'Пользователь не найден' };
    }

    const user = await User.findOne({ where: { id } });
    return user;
  } catch (error) {
    return { msgError: `Ошибка обновления данных пользователя: ${error}`}
  }
}

exports.getUsersPaginated  = async ({ limit = 10, page = 1 }) => {
  try {
    const offset = (page - 1) * limit;
    
    const users = await User.findAndCountAll({
      limit,
      offset,
      order: [['id', 'ASC']]
    });
    
    return {
      total: users.count,
      page,
      limit,
      pages: Math.ceil(users.count / limit),
      data: users.rows
    };
  } catch (error) {
    return { msgError: `Ошибка доступа к списку пользователей: ${error}`}
  }
}

exports.getUserByLogin = async ({ login }) => {
  try {
    const user = await User.findOne({
      where: { login }
    });
    
    if (!user) {
      return {msg: 'Пользователь не найден' }
    };
    
    return user;
  } catch (error) {
    return { msgError: `Ошибка поиска пользователя: ${error}`};
  }
}

exports.deleteUser = async ({ id }) => {
  try {
    const deleteUser = await User.destroy({ where: { id }});
    return { msg: 'Пользователь удален' }
  } catch (error) {
    return { msgError: `Ошибка удаления пользователя: ${error}`};
  }
}
