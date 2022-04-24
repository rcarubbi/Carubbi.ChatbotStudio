using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Extensions
{
    public static class ListExtensions
    {
        private static Random random = new Random();

        public static T GetRandom<T>(this List<T> instance)
        {
            if (instance.Count == 0)
                return default(T);

            var index = random.Next(0, instance.Count);
            return instance[index];
        }
    }
}