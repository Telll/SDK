#!/usr/bin/perl
# compile_templates.pl
# compile all templates for this project for use with mustache

use strict;
use feature ':5.10';
use JSON;
use File::Basename;
use Hash::Merge qw( merge );
my $templates = {};

say "Compiling templates ...\n";

# for each file in ./templates
opendir( TD, "./templates" ) || die("Cannot open templates dir");
my @the_templates = readdir(TD);
closedir(TD);

# read html, js and css fileis
foreach my $f (@the_templates) {
    unless ( ( $f eq "." ) || ( $f eq ".." ) || $f =~ /.mtjs/ ) {
        my ( $name, $path, $suffix ) =
          fileparse( $f, ( '.css', '.html', '.js' ) );
        $f = "./templates/$f";
        open my $input, '<', $f or die "can't open $f: $!";
        my $str = "";
        while (<$input>) {
            chomp;
            $str .= $_;
        }
        close $input or die "can't close $f: $!";

        my $of = {};
        $suffix =~ s/^.//s;
        $of->{name} = $name;
        $of->{$suffix} = $str;
        $templates->{$name} = merge( $of, $templates->{$name} );
    }

}

foreach my $key ( keys $templates ) {
    my $out = "./templates/" . $templates->{$key}->{name} . ".mtjs";
    say $out;
    open my $output, '>', $out or die "cant open $_: $!";
    my $str = encode_json $templates->{$key};
    print $output "module.exports=" . $str;
    close $output or die "cant close $out: $!";
}
