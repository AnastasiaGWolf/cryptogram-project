const bcrypt = require('bcrypt');
const { addNewUser, loginUser, updateUser, getUsersPaginated, getUserByLogin, deleteUser } =
  require('../../../src/services/userService');

jest.mock('../../../models', () => ({
  User: {
    findOne: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  }
}));

const { User } = require('../../../models');

describe('User Service Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ----------------------------
  // 1. addNewUser
  // ----------------------------
  describe('addNewUser', () => {
    it('должен вернуть сообщение, если пользователь уже существует', async () => {
      User.findOne.mockResolvedValue({ id: 1 });

      const result = await addNewUser({ login: 'test', password: '123' });

      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ msg: 'Пользователь существует' });
    });

    it('должен создать нового пользователя', async () => {
      User.findOne.mockResolvedValue(null);

      User.create.mockResolvedValue({
        id: 1,
        login: 'test',
      });

      const result = await addNewUser({ login: 'test', password: 'pass' });

      expect(User.create).toHaveBeenCalled();
      expect(result).toEqual({ id: 1, login: 'test' });
    });

    it('должен вернуть ошибку при исключении', async () => {
      User.findOne.mockRejectedValue(new Error('DB error'));

      const result = await addNewUser({ login: 'test', password: '123' });

      expect(result.msgError).toContain('Ошибка добавления нового пользователя');
    });
  });

  // ----------------------------
  // 2. loginUser
  // ----------------------------
  describe('loginUser', () => {
    it('должен вернуть сообщение, если пользователь не найден', async () => {
      User.findOne.mockResolvedValue(null);

      const result = await loginUser({ login: 'test', password: '123' });

      expect(result.msg).toBe('Пользователь с таким логином не найден');
    });

    it('должен вернуть сообщение при неверном пароле', async () => {
      User.findOne.mockResolvedValue({
        id: 1,
        login: 'test',
        password: 'HASHED_PASS'
      });

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await loginUser({ login: 'test', password: 'wrong' });

      expect(result.msg).toBe('Неверный пароль');
    });

    it('должен вернуть пользователя при успешном входе', async () => {
      User.findOne.mockResolvedValue({
        id: 1,
        login: 'test',
        password: 'HASHED'
      });

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await loginUser({ login: 'test', password: '123' });

      expect(result.id).toBe(1);
      expect(result.login).toBe('test');
    });
  });

  // ----------------------------
  // 3. updateUser
  // ----------------------------
  describe('updateUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('должен обновить пользователя и вернуть обновлённые данные', async () => {
    const id = 1;
    const updatedData = { login: 'new-login' };

    // Sequelize возвращает массив: [количество_обновлений]
    User.update.mockResolvedValue([1]);

    const updatedUserMock = { id, login: 'new-login' };
    User.findOne.mockResolvedValue(updatedUserMock);

    const result = await updateUser({ id, updatedData });

    expect(User.update).toHaveBeenCalledWith(
      { updatedData },
      { where: { id } }
    );

    expect(User.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(updatedUserMock);
  });

  test('должен вернуть сообщение, если пользователь не найден', async () => {
    const id = 999;
    const updatedData = { login: 'login' };

    User.update.mockResolvedValue([0]);

    const result = await updateUser({ id, updatedData });

    expect(result).toEqual({ msg: 'Пользователь не найден' });
  });

  test('должен вернуть ошибку, если произошёл сбой', async () => {
    const id = 1;
    const updatedData = { login: 'some-login' };

    User.update.mockRejectedValue(new Error('DB error'));

    const result = await updateUser({ id, updatedData });

    expect(result.msgError).toContain('Ошибка обновления данных пользователя');
  });
});

  // ----------------------------
  // 4. getUsersPaginated
  // ----------------------------
  describe('getUsersPaginated', () => {
    it('должен вернуть пагинированный список пользователей', async () => {
      User.findAndCountAll.mockResolvedValue({
        count: 25,
        rows: [{ id: 1 }, { id: 2 }]
      });

      const result = await getUsersPaginated({ page: 1, limit: 2 });

      expect(result.total).toBe(25);
      expect(result.pages).toBe(13); // 25 / 2 = 12.5 округление вверх
      expect(result.data.length).toBe(2);
    });

    it('должен вернуть ошибку при исключении', async () => {
      User.findAndCountAll.mockRejectedValue(new Error('Fail'));

      const result = await getUsersPaginated({ page: 1, limit: 2 });

      expect(result.msgError).toContain('Ошибка доступа к списку пользователей');
    });
  });

  // ----------------------------
  // 5. getUserByLogin
  // ----------------------------
  describe('getUserByLogin', () => {
    it('должен вернуть сообщение, если пользователь не найден', async () => {
      User.findOne.mockResolvedValue(null);

      const result = await getUserByLogin({ login: 'xxx' });

      expect(result.msg).toBe('Пользователь не найден');
    });

    it('должен вернуть пользователя', async () => {
      User.findOne.mockResolvedValue({
        id: 1,
        login: 'test'
      });

      const result = await getUserByLogin({ login: 'test' });

      expect(result.login).toBe('test');
    });
  });

  // ----------------------------
  // 6. deleteUser
  // ----------------------------
  describe('deleteUser', () => {
    it('должен удалить пользователя', async () => {
      User.destroy.mockResolvedValue(1);

      const result = await deleteUser({ id: 1 });

      expect(User.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result.msg).toBe('Пользователь удален');
    });

    it('должен вернуть ошибку при исключении', async () => {
      User.destroy.mockRejectedValue(new Error('ERR'));

      const result = await deleteUser({ id: 1 });

      expect(result.msgError).toContain('Ошибка удаления пользователя');
    });
  });
});
