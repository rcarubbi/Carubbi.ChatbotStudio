using System;
using System.IO;
using System.Linq;
using System.Reflection;

namespace Carubbi.BotEditor.Api.Forms
{
    public class FormStepAssemblyResolver : IDisposable
    {
        public FormStepAssemblyResolver()
        {
           AppDomain.CurrentDomain.AssemblyResolve += CurrentDomain_AssemblyResolve; 
        }

        private Assembly CurrentDomain_AssemblyResolve(object sender, ResolveEventArgs args)
        {
            var assembly = AppDomain.CurrentDomain.GetAssemblies().FirstOrDefault(a => a.GetName().FullName == args.Name);

            if (assembly != null)
            {
                return assembly;
            }

            var assemblyName = new AssemblyName(args.Name);
            var assemblyFileName = $"{assemblyName.Name}.dll";
            string assemblyPath;
            var assemblyDirectory = AppDomain.CurrentDomain.RelativeSearchPath;

            if (assemblyName.Name.EndsWith(".resources"))
            {
                var resourceDirectory = Path.Combine(assemblyDirectory, assemblyName.CultureName);
                assemblyPath = Path.Combine(resourceDirectory, assemblyFileName);
            }
            else
            {
                assemblyPath = Path.Combine(assemblyDirectory, assemblyFileName);
            }

            if (File.Exists(assemblyPath))
            {
                return Assembly.LoadFrom(assemblyPath);
            }

            return null;
        }

        public void Dispose()
        {
           AppDomain.CurrentDomain.AssemblyResolve -= CurrentDomain_AssemblyResolve;
        }
    }
}