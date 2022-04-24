namespace Carubbi.BotEditor.Backend.Api
{
    public static class SimpleFactory<T> where T : new()
    {
        public static T Create()
        {
            return new T();
        }
    }
}